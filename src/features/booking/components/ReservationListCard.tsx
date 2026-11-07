import React from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { Booking } from '../types/booking.types';
import {
  bookingToDetailParams,
  canAccessBookingChat,
  canRequestCancel,
  formatBookingScheduleShort,
  getBadgeTone,
  getStatusBadgeLabel,
  getStatusSectionLabel,
} from '../utils/bookingStatus';
import { COLORS } from '../../../constants/colors';

type Props = {
  booking: Booking;
  onCancelRequest?: (bookingId: string) => void;
  onRefresh?: () => void;
};

export default function ReservationListCard({
  booking,
  onCancelRequest,
}: Props) {
  const router = useRouter();
  const badgeTone = getBadgeTone(booking.status);
  const chatAllowed = canAccessBookingChat(booking);
  const cancelAllowed = canRequestCancel(booking);

  const openDetail = () => {
    router.push({
      pathname: '/reservation/[bookingId]',
      params: {
        bookingId: booking.id,
        ...bookingToDetailParams(booking),
      },
    });
  };

  const openChat = () => {
    if (!chatAllowed) {
      Alert.alert(
        '대화 불가',
        '예약일이 지나 대화방 이용이 제한되었어요. 문의가 필요하면 고객센터를 이용해 주세요.'
      );
      return;
    }

    router.push({
      pathname: '/chat/[bookingId]',
      params: {
        bookingId: booking.id,
        sellerId: booking.sellerId,
        reservationNumber: booking.reservationNumber,
      },
    });
  };

  const openReview = () => {
    router.push({
      pathname: '/review/[bookingId]',
      params: {
        bookingId: booking.id,
        sellerId: booking.sellerId,
        productName: booking.productName,
        mode: booking.reviewWritten ? 'view' : 'write',
      },
    });
  };

  const confirmCancel = () => {
    Alert.alert(
      '예약 취소 요청',
      '예약을 취소 요청할까요? 취소·환불 정책에 따라 처리됩니다.',
      [
        { text: '닫기', style: 'cancel' },
        {
          text: '취소 요청',
          style: 'destructive',
          onPress: () => onCancelRequest?.(booking.id),
        },
      ]
    );
  };

  const renderActions = () => {
    switch (booking.status) {
      case 'CONFIRMED':
        return (
          <>
            <Pressable style={styles.secondaryBtn} onPress={openDetail}>
              <Text style={styles.secondaryBtnText}>예약 상세</Text>
            </Pressable>
            <Pressable
              style={[styles.primaryBtn, !chatAllowed && styles.btnDisabled]}
              onPress={openChat}
            >
              <Text style={styles.primaryBtnText}>대화하기</Text>
            </Pressable>
            {cancelAllowed ? (
              <Pressable style={styles.textBtn} onPress={confirmCancel}>
                <Text style={styles.textBtnLabel}>예약 취소 요청</Text>
              </Pressable>
            ) : null}
          </>
        );
      case 'COMPLETED':
        return (
          <>
            <Pressable style={styles.secondaryBtn} onPress={openDetail}>
              <Text style={styles.secondaryBtnText}>예약 상세</Text>
            </Pressable>
            <Pressable style={styles.primaryBtn} onPress={openReview}>
              <Text style={styles.primaryBtnText}>
                {booking.reviewWritten ? '후기 확인' : '후기 작성'}
              </Text>
            </Pressable>
          </>
        );
      default:
        return (
          <>
            <Pressable style={styles.secondaryBtn} onPress={openDetail}>
              <Text style={styles.secondaryBtnText}>예약 상세</Text>
            </Pressable>
            <Pressable style={styles.primaryBtn} onPress={openDetail}>
              <Text style={styles.primaryBtnText}>
                {booking.status === 'REFUND_PENDING' ||
                booking.status === 'REFUNDED'
                  ? '환불 상태 확인'
                  : '상태 확인'}
              </Text>
            </Pressable>
          </>
        );
    }
  };

  return (
    <Pressable style={styles.card} onPress={openDetail}>
      <View style={styles.cardHeader}>
        <Text style={styles.sectionLabel}>
          {getStatusSectionLabel(booking.status)}
        </Text>
        <View
          style={[
            styles.badge,
            badgeTone === 'success' && styles.badgeSuccess,
            badgeTone === 'warning' && styles.badgeWarning,
            badgeTone === 'neutral' && styles.badgeNeutral,
            badgeTone === 'muted' && styles.badgeMuted,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              badgeTone === 'success' && styles.badgeTextSuccess,
              badgeTone === 'warning' && styles.badgeTextWarning,
            ]}
          >
            {getStatusBadgeLabel(booking)}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <Image source={{ uri: booking.productImage }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.productName}>{booking.productName}</Text>
          <Text style={styles.seller}>
            {booking.sellerNickname} · {booking.sellerAge}세
          </Text>
          <Text style={styles.schedule}>
            {formatBookingScheduleShort(booking)}
          </Text>
          <Text style={styles.price}>
            {booking.totalAmount.toLocaleString('ko-KR')}원
          </Text>
        </View>
      </View>

      <View style={styles.actions}>{renderActions()}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeSuccess: {
    backgroundColor: COLORS.successBg,
  },
  badgeWarning: {
    backgroundColor: '#FFF4E5',
  },
  badgeNeutral: {
    backgroundColor: COLORS.surfaceMuted,
  },
  badgeMuted: {
    backgroundColor: COLORS.surfaceAlt,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  badgeTextSuccess: {
    color: COLORS.success,
  },
  badgeTextWarning: {
    color: '#B54708',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceGray,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  seller: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  schedule: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  price: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.text,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
    alignItems: 'center',
  },
  secondaryBtn: {
    flex: 1,
    minWidth: '40%',
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  primaryBtn: {
    flex: 1,
    minWidth: '40%',
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  primaryBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.white,
  },
  btnDisabled: {
    opacity: 0.55,
  },
  textBtn: {
    width: '100%',
    paddingVertical: 6,
    alignItems: 'center',
  },
  textBtnLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    textDecorationLine: 'underline',
  },
});
