import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';

type SellerMyMenuRoute =
  | '/seller/profile'
  | '/seller/reservation-history'
  | '/seller/products'
  | '/seller/schedule'
  | '/seller/reservations'
  | '/seller/settings';

/** SELL-008 판매자 마이페이지 */
export default function SELL008Screen() {
  const router = useRouter();

  const menuItems: { label: string; route?: SellerMyMenuRoute }[] = [
    { label: '내 프로필', route: '/seller/profile' },
    { label: '예약 내역', route: '/seller/reservation-history' },
    { label: '판매 상품 관리', route: '/seller/products' },
    { label: '일정 관리', route: '/seller/schedule' },
    { label: '예약 관리', route: '/seller/reservations' },
    { label: '설정', route: '/seller/settings' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>마이페이지(판매자)</Text>

      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>?</Text>
        </View>

        <View>
          <Text style={styles.nickname}>판매자님, 안녕하세요</Text>
          <Text style={styles.description}>
            프로필과 판매 활동을 여기서 관리할 수 있어요.
          </Text>
        </View>
      </View>

      {menuItems.map((item) => (
        <Pressable
          style={styles.menu}
          key={item.label}
          onPress={() => {
            if (item.route) {
              router.push(item.route);
            }
          }}
        >
          <Text style={styles.menuText}>{item.label}</Text>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 25,
    fontWeight: '900',
    margin: 20,
    color: COLORS.text,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 20,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 15,
    marginBottom: 20,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 22,
  },
  nickname: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  description: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 5,
  },
  menu: {
    height: 58,
    paddingHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  arrow: {
    fontSize: 22,
    color: COLORS.textPlaceholder,
  },
});
