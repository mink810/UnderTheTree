import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { COLORS } from '@/constants/colors';

/** BUY-010 예약 대화방 — 다음 단계에서 구현 */
export default function BookingChatScreen() {
  const router = useRouter();
  const { bookingId, sellerId, reservationNumber } = useLocalSearchParams<{
    bookingId: string;
    sellerId: string;
    reservationNumber?: string;
  }>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.title}>대화</Text>
        <View style={styles.back} />
      </View>

      <View style={styles.body}>
        <Text style={styles.placeholder}>BUY-010 대화방</Text>
        <Text style={styles.line}>예약 ID: {bookingId ?? '-'}</Text>
        <Text style={styles.line}>판매자 ID: {sellerId ?? '-'}</Text>
        <Text style={styles.line}>
          예약 번호: {reservationNumber ?? '-'}
        </Text>
        <Text style={styles.hint}>
          결제 완료 후 대화방 UI 연결 준비 완료. 메시지·권한 검증은
          백엔드 연동 시 구현합니다.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  body: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  line: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  hint: {
    marginTop: 20,
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
