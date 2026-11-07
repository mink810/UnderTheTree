import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ReviewSortOption } from '../types/review-list.types';
import { REVIEW_SORT_LABELS } from '../utils/reviewSort';
import { COLORS } from '../../../constants/colors';

const OPTIONS: ReviewSortOption[] = ['NEWEST', 'RATING_HIGH', 'RATING_LOW'];

type Props = {
  visible: boolean;
  selected: ReviewSortOption;
  onSelect: (option: ReviewSortOption) => void;
  onClose: () => void;
};

export default function ReviewSortMenu({
  visible,
  selected,
  onSelect,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.menu}>
          {OPTIONS.map((option) => {
            const active = option === selected;

            return (
              <Pressable
                key={option}
                style={styles.row}
                onPress={() => {
                  onSelect(option);
                  onClose();
                }}
              >
                <Text
                  style={[styles.label, active && styles.labelActive]}
                >
                  {REVIEW_SORT_LABELS[option]}
                </Text>
                {active ? <Text style={styles.check}>✓</Text> : null}
              </Pressable>
            );
          })}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-start',
    paddingTop: 120,
    paddingHorizontal: 20,
  },
  menu: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  label: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '600',
  },
  labelActive: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  check: {
    fontSize: 16,
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
});
