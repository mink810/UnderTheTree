import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { COLORS } from '@/constants/colors';

import { SELLER_REGION_OPTIONS } from '../data/sellerOnboarding.mock';
import { SellerBasicInfoDraft } from '../types/sellerOnboarding.types';
import {
  SELLER_INTRO_MAX_LENGTH,
  SellerBasicInfoFieldErrors,
} from '../utils/sellerBasicInfoValidation';

type Props = {
  verifiedName: string;
  ageLabel: string;
  draft: SellerBasicInfoDraft;
  errors: SellerBasicInfoFieldErrors;
  onChange: (
    patch: Partial<SellerBasicInfoDraft> & {
      snsLinks?: Partial<SellerBasicInfoDraft['snsLinks']>;
    }
  ) => void;
};

function ReadOnlyField({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.readOnlyBox}>
        <Text style={styles.readOnlyText}>{value}</Text>
        <View style={styles.lockRow}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.lockHint}>{hint}</Text>
        </View>
      </View>
    </View>
  );
}

export default function SellerProfileForm({
  verifiedName,
  ageLabel,
  draft,
  errors,
  onChange,
}: Props) {
  const [regionModalVisible, setRegionModalVisible] = useState(false);
  const introLength = draft.introduction.length;

  return (
    <View style={styles.form}>
      <View style={styles.heroIcon}>
        <Text style={styles.heroIconText}>🪪</Text>
      </View>
      <Text style={styles.heroTitle}>판매자 정보를 입력해주세요.</Text>
      <Text style={styles.heroSub}>구매자에게 보여지는 기본 정보예요.</Text>

      <ReadOnlyField
        label="이름"
        value={verifiedName}
        hint="본인 인증으로 확인된 정보예요."
      />
      <ReadOnlyField
        label="나이"
        value={ageLabel}
        hint="본인 인증으로 확인된 정보예요."
      />

      <View style={styles.field}>
        <Text style={styles.label}>
          지역 <Text style={styles.required}>*</Text>
        </Text>
        <Pressable
          style={styles.selectBox}
          onPress={() => setRegionModalVisible(true)}
        >
          <Text
            style={[
              styles.selectText,
              !draft.region && styles.selectPlaceholder,
            ]}
          >
            {draft.region || '지역을 선택해 주세요'}
          </Text>
          <Text style={styles.chevron}>▾</Text>
        </Pressable>
        {errors.region ? (
          <Text style={styles.errorText}>{errors.region}</Text>
        ) : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>
          자기소개 <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.textArea}
          multiline
          textAlignVertical="top"
          placeholder="본인을 한 문장으로 소개해보세요."
          placeholderTextColor={COLORS.textPlaceholder}
          value={draft.introduction}
          onChangeText={(introduction) => onChange({ introduction })}
          maxLength={SELLER_INTRO_MAX_LENGTH}
        />
        <View style={styles.counterRow}>
          {errors.introduction ? (
            <Text style={styles.errorText}>{errors.introduction}</Text>
          ) : (
            <View />
          )}
          <Text style={styles.counter}>
            {introLength} / {SELLER_INTRO_MAX_LENGTH}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>SNS 계정 (선택)</Text>

      <View style={styles.field}>
        <View style={styles.snsLabelRow}>
          <Text style={styles.snsIcon}>📷</Text>
          <Text style={styles.label}>인스타그램</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="아이디를 입력하세요. (예: @username)"
          placeholderTextColor={COLORS.textPlaceholder}
          autoCapitalize="none"
          value={draft.snsLinks.instagram ?? ''}
          onChangeText={(instagram) =>
            onChange({ snsLinks: { instagram } })
          }
        />
        {errors.instagram ? (
          <Text style={styles.errorText}>{errors.instagram}</Text>
        ) : null}
      </View>

      <View style={styles.field}>
        <View style={styles.snsLabelRow}>
          <Text style={styles.snsIcon}>▶</Text>
          <Text style={styles.label}>유튜브</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="채널 URL을 입력하세요."
          placeholderTextColor={COLORS.textPlaceholder}
          autoCapitalize="none"
          value={draft.snsLinks.youtube ?? ''}
          onChangeText={(youtube) => onChange({ snsLinks: { youtube } })}
        />
        {errors.youtube ? (
          <Text style={styles.errorText}>{errors.youtube}</Text>
        ) : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>기타 SNS</Text>
        <TextInput
          style={styles.input}
          placeholder="URL을 입력하세요."
          placeholderTextColor={COLORS.textPlaceholder}
          autoCapitalize="none"
          value={draft.snsLinks.other ?? ''}
          onChangeText={(other) => onChange({ snsLinks: { other } })}
        />
        {errors.other ? (
          <Text style={styles.errorText}>{errors.other}</Text>
        ) : null}
      </View>

      <Modal
        visible={regionModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRegionModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setRegionModalVisible(false)}
        />
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>지역 선택</Text>
          <FlatList
            data={SELLER_REGION_OPTIONS}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                style={styles.regionRow}
                onPress={() => {
                  onChange({ region: item });
                  setRegionModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.regionRowText,
                    draft.region === item && styles.regionRowTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroIconText: {
    fontSize: 28,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 24,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  required: {
    color: COLORS.primary,
  },
  readOnlyBox: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  readOnlyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  lockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  lockIcon: {
    fontSize: 12,
  },
  lockHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    flex: 1,
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  selectText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
  selectPlaceholder: {
    color: COLORS.textPlaceholder,
  },
  chevron: {
    color: COLORS.textMuted,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 14,
    fontSize: 15,
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  counter: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
  },
  snsLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  snsIcon: {
    fontSize: 16,
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.primaryDark,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalSheet: {
    maxHeight: '55%',
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    color: COLORS.text,
  },
  regionRow: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  regionRowText: {
    fontSize: 15,
    color: COLORS.text,
  },
  regionRowTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
