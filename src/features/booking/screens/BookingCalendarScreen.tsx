import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import BookingCalendarSummary from '@/features/booking/components/BookingCalendarSummary';
import MonthCalendar from '@/features/booking/components/MonthCalendar';
import TimeSlotGrid from '@/features/booking/components/TimeSlotGrid';
import { useBookingAvailability } from '@/features/booking/hooks/useBookingAvailability';
import { sellerProductService } from '@/features/booking/services/sellerProductService';
import { SellerProduct } from '@/features/booking/types/seller-product.types';
import { computeBookingEndTime } from '@/features/booking/utils/availabilityRules';
import {
  formatDateKey,
  formatKoreanDateLabel,
  formatKoreanDateTimeSummary,
  parseDateKey,
  startOfDay,
} from '@/features/booking/utils/time';
import { sellerService } from '@/features/seller/services/sellerService';
import { Seller } from '@/features/seller/types/seller.types';
import { COLORS } from '@/constants/colors';

export default function BookingCalendarScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { sellerId, productId, date, startTime } = useLocalSearchParams<{
    sellerId: string;
    productId: string;
    date?: string;
    startTime?: string;
  }>();

  const [seller, setSeller] = useState<Seller | null>(null);
  const [product, setProduct] = useState<SellerProduct | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const today = startOfDay(new Date());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(
    null
  );

  const durationMinutes = product?.durationMinutes ?? 0;

  const { loading: slotsLoading, isDateSelectable, getTimeOptions } =
    useBookingAvailability(sellerId, durationMinutes);

  useEffect(() => {
    let mounted = true;

    if (!sellerId || !productId) {
      setPageLoading(false);
      return;
    }

    Promise.all([
      sellerService.getSellerById(sellerId),
      sellerProductService.getProductById(productId),
    ])
      .then(([sellerData, productData]) => {
        if (mounted) {
          setSeller(sellerData ?? null);
          setProduct(productData ?? null);
        }
      })
      .finally(() => {
        if (mounted) {
          setPageLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [sellerId, productId]);

  useEffect(() => {
    if (slotsLoading || selectedDate || !product) {
      return;
    }

    if (date) {
      const restored = parseDateKey(date);

      if (isDateSelectable(restored)) {
        setSelectedDate(restored);
        setViewYear(restored.getFullYear());
        setViewMonth(restored.getMonth());

        if (startTime) {
          setSelectedStartTime(startTime);
        }
      }

      return;
    }

    for (let offset = 0; offset < 30; offset += 1) {
      const candidate = new Date(today);
      candidate.setDate(today.getDate() + offset);

      if (isDateSelectable(candidate)) {
        setSelectedDate(candidate);
        setViewYear(candidate.getFullYear());
        setViewMonth(candidate.getMonth());
        break;
      }
    }
  }, [
    slotsLoading,
    selectedDate,
    product,
    today,
    isDateSelectable,
    date,
    startTime,
  ]);

  const selectedDateKey = selectedDate ? formatDateKey(selectedDate) : null;

  const timeOptions = useMemo(
    () => getTimeOptions(selectedDateKey, selectedStartTime),
    [getTimeOptions, selectedDateKey, selectedStartTime]
  );

  const canGoPrevMonth =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const handlePrevMonth = () => {
    if (!canGoPrevMonth) {
      return;
    }

    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
    setSelectedStartTime(null);
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
    setSelectedStartTime(null);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedStartTime(null);
  };

  const canConfirm = Boolean(
    sellerId &&
      productId &&
      product &&
      selectedDateKey &&
      selectedStartTime
  );

  const selectedDateTimeLabel =
    selectedDateKey && selectedStartTime
      ? formatKoreanDateTimeSummary(selectedDateKey, selectedStartTime)
      : null;

  const handleConfirm = () => {
    if (!canConfirm || !product || !selectedDateKey || !selectedStartTime) {
      return;
    }

    const endTime = computeBookingEndTime(
      selectedStartTime,
      product.durationMinutes
    );

    router.push({
      pathname: '/booking/[sellerId]/confirm',
      params: {
        sellerId,
        productId,
        date: selectedDateKey,
        startTime: selectedStartTime,
        endTime,
        durationMinutes: String(product.durationMinutes),
        price: String(product.price),
      },
    });
  };

  const loading = pageLoading || slotsLoading;

  if (loading) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!seller || !product || !sellerId || !productId) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <Text style={styles.errorText}>예약 정보를 불러올 수 없어요.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>돌아가기</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const summaryHeight = 200 + insets.bottom;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerSide}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>예약 날짜 및 시간 선택</Text>
        <View style={styles.headerSide} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: summaryHeight + 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sellerCard}>
          <Image source={{ uri: seller.imageUrl }} style={styles.avatar} />
          <View style={styles.sellerText}>
            <Text style={styles.sellerTitle}>
              {seller.nickname} · {product.name}
            </Text>
            <Text style={styles.sellerMeta}>
              {product.durationMinutes}분 ·{' '}
              {product.price.toLocaleString('ko-KR')}원
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>날짜를 선택해주세요</Text>

        <MonthCalendar
          year={viewYear}
          month={viewMonth}
          selectedDate={selectedDate}
          today={today}
          isDateSelectable={isDateSelectable}
          onSelectDate={handleSelectDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          canGoPrevMonth={canGoPrevMonth}
        />

        {selectedDateKey ? (
          <TimeSlotGrid
            dateLabel={formatKoreanDateLabel(selectedDateKey)}
            options={timeOptions}
            onSelectTime={setSelectedStartTime}
          />
        ) : null}
      </ScrollView>

      <View style={styles.summaryWrap}>
        <BookingCalendarSummary
          selectedDateTimeLabel={selectedDateTimeLabel}
          durationMinutes={product.durationMinutes}
          price={product.price}
          canConfirm={canConfirm}
          bottomInset={insets.bottom}
          onConfirm={handleConfirm}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  backLink: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.surface,
  },
  headerSide: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: COLORS.text,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  scroll: {
    flex: 1,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceGray,
  },
  sellerText: {
    flex: 1,
    marginLeft: 12,
  },
  sellerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  sellerMeta: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  summaryWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
