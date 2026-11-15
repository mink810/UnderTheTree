import React from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { COLORS } from '@/constants/colors';

import {
  SELLER_PRODUCT_KIND_OPTIONS,
  getProductKindOption,
} from '../constants/sellerProductKinds';
import { useSellerProductRegistration } from '../hooks/useSellerProductRegistration';
/** SELL-013 판매 상품 등록 · SELL-014 수정(동일 폼) */
export default function SELL013Screen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId?: string }>();
  const {
    loading,
    submitting,
    draft,
    updateDraft,
    selectKind,
    isKindTaken,
    fieldErrors,
    canSubmit,
    attempted,
    submit,
    isEditMode,
  } = useSellerProductRegistration(productId);

  const screenTitle = isEditMode ? '상품 수정' : '상품 등록';
  const submitLabel = isEditMode ? '수정 저장' : '상품 등록하기';

  const handleCancel = () => {
    router.back();
  };

  const handleRegister = async () => {
    const result = await submit();
    if (result === 'ok') {
      Alert.alert(
        isEditMode ? '수정 완료' : '등록 완료',
        isEditMode
          ? '변경 사항이 저장되었어요.'
          : '판매 상품이 등록되었어요.',
        [{ text: '확인', onPress: () => router.back() }]
      );
      return;
    }
    if (result === 'duplicate') {
      Alert.alert(
        '등록 불가',
        '같은 종류의 상품은 이미 등록되어 있어요. 기존 상품을 수정해 주세요.'
      );
      return;
    }
    Alert.alert('입력 확인', '필수 항목과 숫자 입력을 확인해 주세요.');
  };

  const err = (key: keyof typeof fieldErrors) =>
    attempted ? fieldErrors[key] : undefined;

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={handleCancel} style={styles.topBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Pressable onPress={handleCancel} style={styles.topBtn}>
          <Text style={styles.cancelText}>취소</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{screenTitle}</Text>
          <Text style={styles.subtitle}>
            {isEditMode
              ? '등록한 상품 정보를 수정할 수 있어요. 상품 종류는 변경할 수 없어요.'
              : '구매자에게 판매할 데이트 상품을 등록해 주세요.'}
          </Text>

          <SectionLabel index="①" label="상품 종류" required />
          <View style={styles.kindRow}>
            {SELLER_PRODUCT_KIND_OPTIONS.map((option) => {
              const selected = draft.kind === option.kind;
              const disabled = isKindTaken(option.kind);
              return (
                <Pressable
                  key={option.kind}
                  style={[
                    styles.kindCard,
                    selected && styles.kindCardSelected,
                    disabled && styles.kindCardDisabled,
                  ]}
                  disabled={disabled || isEditMode}
                  onPress={() => selectKind(option.kind)}
                >
                  <Text style={styles.kindIcon}>{option.icon}</Text>
                  <Text
                    style={[
                      styles.kindTitle,
                      selected && styles.kindTitleSelected,
                    ]}
                  >
                    {option.title}
                  </Text>
                  <Text style={styles.kindSub}>{option.subtitle}</Text>
                  {disabled ? (
                    <Text style={styles.kindTaken}>등록됨</Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
          {err('kind') ? (
            <Text style={styles.error}>{fieldErrors.kind}</Text>
          ) : null}

          <SectionLabel index="②" label="상품명" required />
          <TextInput
            style={styles.input}
            value={draft.name}
            onChangeText={(name) => updateDraft({ name })}
            placeholder="상품명을 입력해 주세요."
            placeholderTextColor={COLORS.textPlaceholder}
          />
          {err('name') ? (
            <Text style={styles.error}>{fieldErrors.name}</Text>
          ) : null}

          <SectionLabel index="③" label="상품 설명" required />
          <TextInput
            style={styles.textArea}
            multiline
            textAlignVertical="top"
            value={draft.description}
            onChangeText={(description) => updateDraft({ description })}
            placeholder="구매자에게 제공할 서비스와 상품에 대해 설명해 주세요."
            placeholderTextColor={COLORS.textPlaceholder}
          />
          {err('description') ? (
            <Text style={styles.error}>{fieldErrors.description}</Text>
          ) : null}

          <SectionLabel index="④" label="판매 가격" required />
          <TextInput
            style={styles.input}
            value={draft.price}
            onChangeText={(price) =>
              updateDraft({ price: price.replace(/[^\d]/g, '') })
            }
            keyboardType="number-pad"
            placeholder="판매 가격을 입력해 주세요."
            placeholderTextColor={COLORS.textPlaceholder}
          />
          <Text style={styles.helper}>원 단위로 입력해 주세요.</Text>
          {draft.kind ? (
            <Text style={styles.refPrice}>
              참고 기본가:{' '}
              {getProductKindOption(draft.kind)?.defaultPrice.toLocaleString()}
              원
            </Text>
          ) : null}
          {err('price') ? (
            <Text style={styles.error}>{fieldErrors.price}</Text>
          ) : null}

          <SectionLabel index="⑤" label="이용 시간" required />
          <TextInput
            style={styles.input}
            value={draft.durationMinutes}
            onChangeText={(durationMinutes) =>
              updateDraft({ durationMinutes: durationMinutes.replace(/[^\d]/g, '') })
            }
            keyboardType="number-pad"
            placeholder="예: 30"
            placeholderTextColor={COLORS.textPlaceholder}
          />
          <Text style={styles.helper}>분 단위로 입력해 주세요.</Text>
          {err('durationMinutes') ? (
            <Text style={styles.error}>{fieldErrors.durationMinutes}</Text>
          ) : null}

          <SectionLabel index="⑥" label="판매 상태" required />
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>판매 여부</Text>
            <View style={styles.switchRight}>
              {draft.isActive ? (
                <View style={styles.sellingBadge}>
                  <Text style={styles.sellingBadgeText}>판매 중</Text>
                </View>
              ) : (
                <View style={styles.pausedBadge}>
                  <Text style={styles.pausedBadgeText}>판매 중지</Text>
                </View>
              )}
              <Switch
                value={draft.isActive}
                onValueChange={(isActive) => updateDraft({ isActive })}
                trackColor={{ false: COLORS.border, true: COLORS.successBg }}
                thumbColor={draft.isActive ? COLORS.success : COLORS.surface}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[
              styles.submitBtn,
              (!canSubmit || submitting) && styles.submitBtnDisabled,
            ]}
            disabled={!canSubmit || submitting}
            onPress={handleRegister}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.submitText}>{submitLabel}</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SectionLabel({
  index,
  label,
  required,
}: {
  index: string;
  label: string;
  required?: boolean;
}) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionIndex}>{index}</Text>
      <Text style={styles.sectionLabel}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: COLORS.background },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  topBtn: { padding: 12 },
  backText: { fontSize: 22, color: COLORS.text },
  cancelText: { fontSize: 15, fontWeight: '600', color: COLORS.textMuted },
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },
  title: { fontSize: 22, fontWeight: '900', color: COLORS.text, marginTop: 4 },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    marginTop: 8,
  },
  sectionIndex: { fontSize: 14, fontWeight: '800', color: COLORS.text },
  sectionLabel: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  required: { color: COLORS.primary },
  kindRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  kindCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    minHeight: 120,
  },
  kindCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLighter,
  },
  kindCardDisabled: { opacity: 0.45 },
  kindIcon: { fontSize: 26, marginBottom: 8 },
  kindTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  kindTitleSelected: { color: COLORS.primary },
  kindSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  kindTaken: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSubtle,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
    marginBottom: 6,
  },
  textArea: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
    minHeight: 120,
    marginBottom: 6,
  },
  helper: { fontSize: 12, color: COLORS.textMuted, marginBottom: 4 },
  refPrice: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 8 },
  error: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchLabel: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  switchRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sellingBadge: {
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  sellingBadgeText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '700',
  },
  pausedBadge: {
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  pausedBadgeText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitBtnDisabled: { backgroundColor: COLORS.borderDark },
  submitText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
});
