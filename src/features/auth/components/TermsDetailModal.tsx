import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';

type Props = {
  visible: boolean;
  title: string;
  body: string;
  onClose: () => void;
};

export default function TermsDetailModal({
  visible,
  title,
  body,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <Text style={styles.title}>{title}</Text>
        <ScrollView style={styles.scroll}>
          <Text style={styles.body}>{body}</Text>
        </ScrollView>
        <Pressable style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>닫기</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const TERMS_PLACEHOLDER =
  '본 약관은 서비스 이용과 관련된 권리·의무를 규정합니다. 실제 약관 전문은 COM-010·COM-011에서 연동할 예정입니다.';

export function serviceTermsBody(): string {
  return TERMS_PLACEHOLDER;
}

export function privacyPolicyBody(): string {
  return (
    '개인정보 수집·이용 목적, 보유 기간, 제3자 제공 등에 관한 내용이 이곳에 표시됩니다.'
  );
}

export function marketingTermsBody(): string {
  return '이벤트·혜택 등 마케팅 정보를 앱 푸시·이메일·SMS로 받아보는 것에 동의합니다.';
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 12,
  },
  scroll: { maxHeight: 360 },
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
  closeBtn: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 15,
  },
});
