import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../constants/colors';

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function ProfileSection({ title, children }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  title: {
    fontSize: 19,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 16,
  },
  content: {
    gap: 12,
  },
});
