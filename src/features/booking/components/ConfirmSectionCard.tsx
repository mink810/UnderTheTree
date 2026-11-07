import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../constants/colors';

type Props = {
  title: string;
  onEdit?: () => void;
  editLabel?: string;
  children: ReactNode;
};

export default function ConfirmSectionCard({
  title,
  onEdit,
  editLabel = '수정',
  children,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onEdit ? (
          <Pressable onPress={onEdit} hitSlop={8}>
            <Text style={styles.edit}>{editLabel}</Text>
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  edit: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
});
