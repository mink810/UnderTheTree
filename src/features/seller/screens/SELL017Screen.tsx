import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { COLORS } from '@/constants/colors';
import { formatDateKey } from '@/features/booking/utils/time';

import SellerOpenSlotModal from '../components/SellerOpenSlotModal';
import SellerScheduleCalendar from '../components/SellerScheduleCalendar';
import { sellerProductCatalogService } from '../services/sellerProductCatalogService';
import { sellerScheduleService } from '../services/sellerScheduleService';
import {
  DayMarkerKind,
  SellerScheduleSlot,
  SellerSlotStatus,
  SlotRepeatRule,
} from '../types/seller-schedule.types';
import { expandRepeatDates } from '../utils/sellerScheduleRepeat';
import {
  formatKoreanWeekday,
  isPastDateKey,
  isSlotEndBeforeNow,
  isValidTimeRange,
} from '../utils/sellerScheduleTime';

const STATUS_LABEL: Record<SellerSlotStatus, string> = {
  OPEN: '예약 가능',
  RESERVED: '예약 완료',
  CLOSED: '마감',
  COMPLETED: '이용 완료',
  CANCELLED: '예약 취소',
};

function markerForDay(slots: SellerScheduleSlot[]): DayMarkerKind {
  if (slots.length === 0) {
    return 'none';
  }
  const actionable = slots.filter(
    (s) => s.status !== 'CLOSED' && s.status !== 'CANCELLED'
  );
  if (actionable.length === 0) {
    return 'none';
  }
  const hasReserved = actionable.some(
    (s) => s.status === 'RESERVED' || s.status === 'COMPLETED'
  );
  const hasOpen = actionable.some((s) => s.status === 'OPEN');
  if (hasReserved && hasOpen) {
    return 'mixed';
  }
  if (hasReserved) {
    return 'mixed';
  }
  return 'open';
}

function statusBadgeStyle(status: SellerSlotStatus) {
  switch (status) {
    case 'OPEN':
      return { bg: '#E8F5E9', fg: '#2E7D32' };
    case 'RESERVED':
    case 'COMPLETED':
      return { bg: '#FFEBEE', fg: '#C62828' };
    case 'CLOSED':
      return { bg: COLORS.surfaceMuted, fg: COLORS.textMuted };
    case 'CANCELLED':
      return { bg: '#FFF3E0', fg: '#E65100' };
    default:
      return { bg: COLORS.surfaceMuted, fg: COLORS.text };
  }
}

/** SELL-017 예약 가능 일정 관리 */
export default function SELL017Screen() {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [allSlots, setAllSlots] = useState<SellerScheduleSlot[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editSlot, setEditSlot] = useState<SellerScheduleSlot | null>(null);

  const load = useCallback(async () => {
    const list = await sellerScheduleService.listSlots();
    setAllSlots(list);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const selectedKey = formatDateKey(selectedDate);
  const daySlots = useMemo(
    () =>
      allSlots
        .filter((s) => s.date === selectedKey)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [allSlots, selectedKey]
  );

  const openCount = daySlots.filter((s) => s.status === 'OPEN').length;

  const getMarker = useCallback(
    (dateKey: string): DayMarkerKind => {
      const day = allSlots.filter((s) => s.date === dateKey);
      return markerForDay(day);
    },
    [allSlots]
  );

  const showError = (err: unknown) => {
    const code =
      err instanceof Error ? err.message : 'UNKNOWN';
    const map: Record<string, string> = {
      DUPLICATE_SLOT: '동일한 시간대에 이미 슬롯이 있어요.',
      NOT_EDITABLE: '예약된 슬롯은 수정할 수 없어요.',
      NOT_DELETABLE: '예약된 슬롯은 삭제할 수 없어요.',
      NOT_FOUND: '슬롯을 찾을 수 없어요.',
      PRODUCT_INACTIVE: '판매 중지된 상품에는 슬롯을 열 수 없어요.',
    };
    Alert.alert('안내', map[code] ?? '저장에 실패했어요. 다시 시도해 주세요.');
  };

  const handleOpenSlots = async (payload: {
    startTime: string;
    endTime: string;
    productId: string;
    repeat: SlotRepeatRule;
  }) => {
    if (!isValidTimeRange(payload.startTime, payload.endTime)) {
      Alert.alert('안내', '종료 시간은 시작 시간보다 늦어야 해요.');
      return;
    }

    const product = await sellerProductCatalogService.getById(payload.productId);
    if (!product?.isActive) {
      throw new Error('PRODUCT_INACTIVE');
    }

    const anchorKey = editSlot ? editSlot.date : selectedKey;
    if (isPastDateKey(anchorKey, today)) {
      Alert.alert('안내', '과거 날짜에는 슬롯을 등록할 수 없어요.');
      return;
    }

    if (editSlot) {
      try {
        await sellerScheduleService.updateOpenSlot(editSlot.id, {
          startTime: payload.startTime,
          endTime: payload.endTime,
          productId: payload.productId,
        });
        setEditSlot(null);
        await load();
      } catch (e) {
        showError(e);
        throw e;
      }
      return;
    }

    const dates = expandRepeatDates(anchorKey, payload.repeat, today);
    let opened = 0;
    const failures: string[] = [];
    for (const date of dates) {
      if (isPastDateKey(date, today)) {
        continue;
      }
      try {
        await sellerScheduleService.openSlot({
          date,
          startTime: payload.startTime,
          endTime: payload.endTime,
          productId: payload.productId,
        });
        opened += 1;
      } catch (e) {
        if (e instanceof Error && e.message === 'DUPLICATE_SLOT') {
          failures.push(date);
        } else {
          showError(e);
          throw e;
        }
      }
    }
    await load();
    if (opened === 0 && failures.length > 0) {
      Alert.alert('안내', '선택한 날짜에 중복되는 시간대가 있어 등록되지 않았어요.');
    } else if (failures.length > 0) {
      Alert.alert(
        '등록 완료',
        `${opened}개 슬롯을 열었어요. 중복으로 건너뛴 날짜: ${failures.length}건`
      );
    }
  };

  const onSlotPress = (slot: SellerScheduleSlot) => {
    const actions: { text: string; style?: 'destructive' | 'cancel'; onPress?: () => void }[] =
      [];

    if (slot.status === 'OPEN') {
      actions.push({
        text: '슬롯 수정',
        onPress: () => {
          setEditSlot(slot);
          setOpenModal(true);
        },
      });
      actions.push({
        text: '슬롯 마감',
        onPress: () => {
          void sellerScheduleService
            .setSlotStatus(slot.id, 'CLOSED')
            .then(load)
            .catch(showError);
        },
      });
      actions.push({
        text: '슬롯 삭제',
        style: 'destructive',
        onPress: () => {
          void sellerScheduleService.deleteSlot(slot.id).then(load).catch(showError);
        },
      });
    } else if (slot.status === 'CANCELLED') {
      actions.push({
        text: '다시 예약 가능으로',
        onPress: () => {
          void sellerScheduleService
            .setSlotStatus(slot.id, 'OPEN')
            .then(load)
            .catch(showError);
        },
      });
      actions.push({
        text: '슬롯 삭제',
        style: 'destructive',
        onPress: () => {
          void sellerScheduleService.deleteSlot(slot.id).then(load).catch(showError);
        },
      });
    } else if (slot.status === 'CLOSED') {
      actions.push({
        text: '다시 열기',
        onPress: () => {
          void sellerScheduleService
            .setSlotStatus(slot.id, 'OPEN')
            .then(load)
            .catch(showError);
        },
      });
      actions.push({
        text: '슬롯 삭제',
        style: 'destructive',
        onPress: () => {
          void sellerScheduleService.deleteSlot(slot.id).then(load).catch(showError);
        },
      });
    } else {
      actions.push({ text: '닫기', style: 'cancel' });
    }

    if (actions.length === 0 || (actions.length === 1 && actions[0].style === 'cancel')) {
      Alert.alert(
        `${slot.startTime} ~ ${slot.endTime}`,
        STATUS_LABEL[slot.status]
      );
      return;
    }

    actions.push({ text: '취소', style: 'cancel' });
    Alert.alert(
      `${slot.startTime} ~ ${slot.endTime}`,
      STATUS_LABEL[slot.status],
      actions
    );
  };

  const closeAllOpen = () => {
    Alert.alert(
      '선택 날짜 전체 마감',
      '예약 가능(OPEN) 상태인 슬롯을 모두 마감할까요?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '마감',
          onPress: () => {
            void sellerScheduleService
              .closeAllOpenOnDate(selectedKey)
              .then((n) => {
                if (n === 0) {
                  Alert.alert('안내', '마감할 예약 가능 슬롯이 없어요.');
                }
                return load();
              })
              .catch(showError);
          },
        },
      ]
    );
  };

  const monthPart = selectedDate.getMonth() + 1;
  const dayPart = selectedDate.getDate();
  const weekday = formatKoreanWeekday(selectedKey);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>예약 일정 관리</Text>
        <View style={styles.back} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <SellerScheduleCalendar
          year={viewYear}
          month={viewMonth}
          selectedDate={selectedDate}
          today={today}
          getMarker={getMarker}
          onSelectDate={setSelectedDate}
          onPrevMonth={() => {
            if (viewMonth === 0) {
              setViewYear((y) => y - 1);
              setViewMonth(11);
            } else {
              setViewMonth((m) => m - 1);
            }
          }}
          onNextMonth={() => {
            if (viewMonth === 11) {
              setViewYear((y) => y + 1);
              setViewMonth(0);
            } else {
              setViewMonth((m) => m + 1);
            }
          }}
        />

        <View style={styles.dayHeader}>
          <Text style={styles.dayTitle}>
            {monthPart}월 {dayPart}일 {weekday}요일
          </Text>
          {openCount > 0 ? (
            <View style={styles.openBadge}>
              <Text style={styles.openBadgeText}>{openCount}개 슬롯 오픈</Text>
            </View>
          ) : null}
        </View>

        {daySlots.length === 0 ? (
          <Text style={styles.emptySlots}>등록된 슬롯이 없어요.</Text>
        ) : (
          daySlots.map((slot) => {
            const badge = statusBadgeStyle(slot.status);
            const ended = isSlotEndBeforeNow(
              slot.date,
              slot.endTime,
              new Date()
            );
            return (
              <Pressable
                key={slot.id}
                style={[styles.slotRow, ended && styles.slotRowEnded]}
                disabled={ended}
                onPress={() => onSlotPress(slot)}
              >
                <Text style={styles.slotTime}>
                  {slot.startTime} ~ {slot.endTime}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.statusText, { color: badge.fg }]}>
                    {STATUS_LABEL[slot.status]}
                  </Text>
                </View>
              </Pressable>
            );
          })
        )}

        <Pressable
          style={styles.primaryBtn}
          onPress={() => {
            if (isPastDateKey(selectedKey, today)) {
              Alert.alert('안내', '과거 날짜에는 슬롯을 등록할 수 없어요.');
              return;
            }
            setEditSlot(null);
            setOpenModal(true);
          }}
        >
          <Text style={styles.primaryBtnText}>+ 슬롯 열기</Text>
        </Pressable>

        <Pressable style={styles.secondaryBtn} onPress={closeAllOpen}>
          <Text style={styles.secondaryBtnText}>선택 날짜 전체 마감</Text>
        </Pressable>
      </ScrollView>

      {openModal ? (
        <SellerOpenSlotModal
          key={editSlot?.id ?? `new-${selectedKey}`}
          visible
          dateKey={editSlot?.date ?? selectedKey}
          title={editSlot ? '슬롯 수정' : '슬롯 열기'}
          initialStart={editSlot?.startTime ?? '14:00'}
          initialEnd={editSlot?.endTime ?? '15:00'}
          initialProductId={editSlot?.productId}
          showRepeat={!editSlot}
          onClose={() => {
            setOpenModal(false);
            setEditSlot(null);
          }}
          onSubmit={handleOpenSlots}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  back: { width: 44, height: 44, justifyContent: 'center' },
  backText: { fontSize: 22, color: COLORS.text },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
  },
  scroll: { paddingHorizontal: 20, paddingBottom: 32 },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 12,
  },
  dayTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  openBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  openBadgeText: { fontSize: 12, fontWeight: '700', color: '#2E7D32' },
  emptySlots: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 16,
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  slotRowEnded: { opacity: 0.45 },
  slotTime: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: { fontSize: 12, fontWeight: '700' },
  primaryBtn: {
    marginTop: 20,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  secondaryBtn: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});
