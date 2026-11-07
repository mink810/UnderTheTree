import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/colors';

export default function ChatsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>대화</Text>
      <View style={styles.empty}>
        <Text style={styles.icon}>💬</Text>
        <Text style={styles.message}>아직 대화가 없어요.</Text>
        <Text style={styles.sub}>예약 후 판매자와 대화를 시작할 수 있어요.</Text>
      </View>
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
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 40,
  },
  message: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 15,
    color: COLORS.text,
  },
  sub: {
    fontSize: 12,
    color: COLORS.textSubtle,
    marginTop: 8,
  },
});
