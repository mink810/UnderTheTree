import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/colors';

/** 스플래시 분기 — 강제 업데이트 안내 */
export default function ForceUpdateScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>업데이트가 필요해요</Text>
      <Text style={styles.body}>
        더 안정적인 서비스 이용을 위해 최신 버전으로 업데이트해 주세요.
      </Text>
      <Pressable
        style={styles.btn}
        onPress={() => void Linking.openURL('https://expo.dev')}
      >
        <Text style={styles.btnText}>스토어에서 업데이트</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 28,
  },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 16,
  },
});
