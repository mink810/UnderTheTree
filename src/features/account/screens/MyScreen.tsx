import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';

export default function MyScreen() {
  const router = useRouter();

  const menuItems: { label: string; route?: 'reservations' | 'reviews' }[] = [
    { label: '예약 내역', route: 'reservations' },
    { label: '내가 작성한 후기', route: 'reviews' },
    { label: '포인트' },
    { label: '내 프로필' },
    { label: '설정' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>마이페이지</Text>

      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>?</Text>
        </View>

        <View>
          <Text style={styles.nickname}>로그인이 필요해요.</Text>
          <Text style={styles.description}>
            로그인 기능은 다음 단계에서 구현할게요.
          </Text>
        </View>
      </View>

      {menuItems.map((item) => (
        <Pressable
          style={styles.menu}
          key={item.label}
          onPress={() => {
            if (item.route === 'reservations') {
              router.push('/reservations');
            }
            if (item.route === 'reviews') {
              router.push('/reviews');
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
