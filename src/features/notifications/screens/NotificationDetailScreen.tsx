import React, { useEffect, useState } from 'react';
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

import { bookingToDetailParams } from '@/features/booking/utils/bookingStatus';
import { bookingService } from '@/features/booking/services/bookingService';
import { notificationService } from '@/features/notifications/services/notificationService';
import { AppNotification } from '@/features/notifications/types/notification.types';
import {
  formatBookingDateLabel,
  formatNotificationDetailTime,
  getNotificationIcon,
  getTargetActionLabel,
} from '@/features/notifications/utils/notificationUtils';
import { COLORS } from '@/constants/colors';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function NotificationDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { notificationId } = useLocalSearchParams<{
    notificationId: string;
  }>();

  const [notification, setNotification] = useState<AppNotification | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (!notificationId) {
      setLoading(false);
      return;
    }

    notificationService
      .getNotificationById(notificationId)
      .then(async (data) => {
        if (!mounted || !data) {
          return;
        }

        if (!data.isRead) {
          await notificationService.markAsRead(data.id);
        }

        setNotification({ ...data, isRead: true });
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [notificationId]);

  const handleAction = async () => {
    if (!notification) {
      return;
    }

    const meta = notification.metadata;
    const bookingId =
      meta?.bookingId ?? notification.targetId ?? meta?.chatRoomId;

    switch (notification.targetType) {
      case 'BOOKING_DETAIL':
        if (bookingId) {
          const booking = await bookingService.getBookingById(bookingId);
          if (booking) {
            router.push({
              pathname: '/reservation/[bookingId]',
              params: {
                bookingId,
                ...bookingToDetailParams(booking),
              },
            });
            return;
          }
          router.push({
            pathname: '/reservation/[bookingId]',
            params: { bookingId },
          });
        }
        break;
      case 'CHAT_ROOM':
        if (bookingId) {
          router.push({
            pathname: '/chat/[bookingId]',
            params: {
              bookingId,
              sellerId: meta?.sellerId ?? '',
              reservationNumber: '',
            },
          });
        }
        break;
      case 'REVIEW_WRITE':
        if (bookingId) {
          router.push({
            pathname: '/review/[bookingId]',
            params: { bookingId },
          });
        }
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!notification) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <Text style={styles.error}>알림을 찾을 수 없어요.</Text>
      </SafeAreaView>
    );
  }

  const meta = notification.metadata;
  const actionLabel = getTargetActionLabel(notification.targetType);
  const bottomInset = Math.max(insets.bottom, 12);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>알림 상세</Text>
        <View style={styles.back} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: actionLabel ? bottomInset + 80 : 24,
        }}
      >
        <View style={styles.hero}>
          {notification.type === 'MESSAGE' && meta?.sellerImageUrl ? (
            <Image
              source={{ uri: meta.sellerImageUrl }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.iconWrap}>
              <Text style={styles.icon}>
                {getNotificationIcon(notification.type)}
              </Text>
            </View>
          )}
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.time}>
            {formatNotificationDetailTime(notification.createdAt)}
          </Text>
        </View>

        <View style={styles.messageBox}>
          <Text style={styles.message}>{notification.message}</Text>
        </View>

        {meta &&
        (meta.productName ||
          meta.bookingDate ||
          meta.amount !== undefined) ? (
          <View style={styles.card}>
            {meta.sellerNickname ? (
              <InfoRow
                label="판매자"
                value={`${meta.sellerNickname}${
                  meta.sellerAge ? ` · ${meta.sellerAge}세` : ''
                }`}
              />
            ) : null}
            {meta.productName ? (
              <InfoRow label="상품" value={meta.productName} />
            ) : null}
            {meta.bookingDate ? (
              <InfoRow
                label="예약 날짜"
                value={formatBookingDateLabel(meta.bookingDate)}
              />
            ) : null}
            {meta.startTime ? (
              <InfoRow
                label="예약 시간"
                value={
                  meta.endTime
                    ? `${meta.startTime} ~ ${meta.endTime}`
                    : meta.startTime
                }
              />
            ) : null}
            {meta.amount !== undefined ? (
              <InfoRow
                label="결제 금액"
                value={`${meta.amount.toLocaleString('ko-KR')}원`}
              />
            ) : null}
            {meta.bookingStatus ? (
              <InfoRow label="예약 상태" value={meta.bookingStatus} />
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      {actionLabel ? (
        <View style={[styles.bottomBar, { paddingBottom: bottomInset }]}>
          <Pressable style={styles.actionButton} onPress={handleAction}>
            <Text style={styles.actionButtonText}>{actionLabel}</Text>
          </Pressable>
        </View>
      ) : null}
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
  error: {
    color: COLORS.textSecondary,
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
  back: {
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
  hero: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 26,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 12,
    backgroundColor: COLORS.surfaceGray,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  time: {
    marginTop: 8,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  messageBox: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  infoValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: COLORS.surface,
  },
  actionButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
});
