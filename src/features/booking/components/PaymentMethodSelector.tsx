import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PaymentMethod } from '../types/payment.types';
import { COLORS } from '../../../constants/colors';

type Props = {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  disabled?: boolean;
};

const METHODS: {
  id: PaymentMethod;
  title: string;
  subtitle: string;
  icon: string;
}[] = [
  {
    id: 'CARD',
    title: '신용 / 체크카드',
    subtitle: '카드 결제',
    icon: '💳',
  },
  {
    id: 'EASY_PAY',
    title: '간편결제',
    subtitle: '간편결제',
    icon: '👛',
  },
];

export default function PaymentMethodSelector({
  selected,
  onSelect,
  disabled = false,
}: Props) {
  return (
    <View style={styles.container}>
      {METHODS.map((method) => {
        const isSelected = selected === method.id;

        return (
          <Pressable
            key={method.id}
            style={[styles.row, disabled && styles.rowDisabled]}
            disabled={disabled}
            onPress={() => onSelect(method.id)}
          >
            <Text style={styles.icon}>{method.icon}</Text>
            <View style={styles.textWrap}>
              <Text style={styles.title}>{method.title}</Text>
            </View>
            <View
              style={[
                styles.badge,
                isSelected ? styles.badgeSelected : styles.badgeIdle,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  isSelected ? styles.badgeTextSelected : styles.badgeTextIdle,
                ]}
              >
                {isSelected ? '선택됨' : '선택 가능'}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  rowDisabled: {
    opacity: 0.6,
  },
  icon: {
    fontSize: 22,
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeSelected: {
    backgroundColor: COLORS.successBg,
  },
  badgeIdle: {
    backgroundColor: COLORS.surfaceMuted,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextSelected: {
    color: COLORS.success,
  },
  badgeTextIdle: {
    color: COLORS.textMuted,
  },
});
