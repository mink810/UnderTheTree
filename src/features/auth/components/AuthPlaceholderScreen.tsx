import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/colors';

type Props = {
  screenId: string;
  title: string;
  description: string;
};

export default function AuthPlaceholderScreen({
  screenId,
  title,
  description,
}: Props) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← 뒤로</Text>
      </Pressable>
      <View style={styles.body}>
        <Text style={styles.badge}>{screenId}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
  },
  back: {
    paddingVertical: 12,
  },
  backText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 80,
  },
  badge: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});
