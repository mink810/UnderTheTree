import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { COLORS } from '@/constants/colors';
import { SELLER_REGION_OPTIONS } from '@/features/seller-onboarding/data/sellerOnboarding.mock';

import SellerProfileMbtiGrid from '../components/SellerProfileMbtiGrid';
import SellerProfilePhotoEditor from '../components/SellerProfilePhotoEditor';
import { PROFILE_INTRO_MAX } from '../constants/profileEdit';
import { useSellerProfileEdit } from '../hooks/useSellerProfileEdit';

/** SELL-010 판매자 프로필 수정 */
export default function SELL010Screen() {
  const router = useRouter();
  const {
    loading,
    saving,
    profile,
    updateProfile,
    fieldErrors,
    canSave,
    isDirty,
    save,
    resetToInitial,
  } = useSellerProfileEdit();
  const [regionModalVisible, setRegionModalVisible] = useState(false);
  const [attemptedSave, setAttemptedSave] = useState(false);

  const handleCancel = () => {
    if (isDirty) {
      Alert.alert('변경 취소', '변경 내용을 버리고 나갈까요?', [
        { text: '계속 수정', style: 'cancel' },
        {
          text: '나가기',
          style: 'destructive',
          onPress: () => {
            resetToInitial();
            router.back();
          },
        },
      ]);
      return;
    }
    router.back();
  };

  const handleSave = async () => {
    setAttemptedSave(true);
    if (!canSave) {
      Alert.alert('입력 확인', '필수 항목과 메인 사진을 확인해 주세요.');
      return;
    }
    const ok = await save();
    if (ok) {
      Alert.alert('저장 완료', '프로필이 저장되었어요.', [
        { text: '확인', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('저장 실패', '잠시 후 다시 시도해 주세요. 기존 정보는 유지됩니다.');
    }
  };

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.loadingWrap}>
        <ActivityIndicator color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  const showError = (key: keyof typeof fieldErrors) =>
    attemptedSave ? fieldErrors[key] : undefined;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={handleCancel} style={styles.topBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Pressable onPress={handleCancel} style={styles.cancelBtn}>
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
          <Text style={styles.title}>내 프로필 수정</Text>
          <Text style={styles.subtitle}>
            구매자에게 보여지는 나의 프로필을 관리해 보세요.
          </Text>

          <SellerProfilePhotoEditor
            photos={profile.photos}
            mainPhotoUri={profile.mainPhotoUri}
            onChange={(photos, mainPhotoUri) =>
              updateProfile({ photos, mainPhotoUri })
            }
            error={showError('mainPhotoUri') ?? showError('photos')}
          />

          <Text style={styles.sectionTitle}>기본 정보</Text>

          <View style={styles.field}>
            <Text style={styles.label}>
              이름 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={profile.name}
              onChangeText={(name) => updateProfile({ name })}
              placeholder="이름"
              placeholderTextColor={COLORS.textPlaceholder}
            />
            {showError('name') ? (
              <Text style={styles.error}>{fieldErrors.name}</Text>
            ) : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              나이 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={profile.age}
              onChangeText={(age) => updateProfile({ age })}
              placeholder="나이"
              keyboardType="number-pad"
              placeholderTextColor={COLORS.textPlaceholder}
            />
            {showError('age') ? (
              <Text style={styles.error}>{fieldErrors.age}</Text>
            ) : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
              지역 <Text style={styles.required}>*</Text>
            </Text>
            <Pressable
              style={styles.input}
              onPress={() => setRegionModalVisible(true)}
            >
              <Text
                style={[
                  styles.inputText,
                  !profile.region && styles.placeholder,
                ]}
              >
                {profile.region || '지역을 선택해 주세요'}
              </Text>
            </Pressable>
            {showError('region') ? (
              <Text style={styles.error}>{fieldErrors.region}</Text>
            ) : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>키 (cm)</Text>
            <TextInput
              style={styles.input}
              value={profile.heightCm}
              onChangeText={(heightCm) => updateProfile({ heightCm })}
              placeholder="키"
              keyboardType="number-pad"
              placeholderTextColor={COLORS.textPlaceholder}
            />
            {showError('heightCm') ? (
              <Text style={styles.error}>{fieldErrors.heightCm}</Text>
            ) : null}
          </View>

          <Text style={styles.sectionTitle}>나의 취향</Text>

          <View style={styles.field}>
            <Text style={styles.label}>좋아하는 것</Text>
            <TextInput
              style={styles.input}
              value={profile.favoriteThings}
              onChangeText={(favoriteThings) => updateProfile({ favoriteThings })}
              placeholder="예: 카페, 영화, 여행, 운동"
              placeholderTextColor={COLORS.textPlaceholder}
            />
          </View>

          <SellerProfileMbtiGrid
            value={profile.mbti}
            onChange={(mbti) => updateProfile({ mbti })}
          />

          <Text style={styles.sectionTitle}>자기소개</Text>
          <View style={styles.field}>
            <Text style={styles.label}>
              자기소개 <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.textArea}
              multiline
              textAlignVertical="top"
              value={profile.introduction}
              onChangeText={(introduction) => updateProfile({ introduction })}
              placeholder="나를 소개하는 글을 작성해 주세요."
              placeholderTextColor={COLORS.textPlaceholder}
              maxLength={PROFILE_INTRO_MAX}
            />
            <View style={styles.counterRow}>
              {showError('introduction') ? (
                <Text style={styles.error}>{fieldErrors.introduction}</Text>
              ) : (
                <View />
              )}
              <Text style={styles.counter}>
                {profile.introduction.length} / {PROFILE_INTRO_MAX}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[
              styles.saveBtn,
              (!canSave || saving) && styles.saveBtnDisabled,
            ]}
            disabled={!canSave || saving}
            onPress={handleSave}
          >
            {saving ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.saveBtnText}>저장하기</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>

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
                  updateProfile({ region: item });
                  setRegionModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.regionRowText,
                    profile.region === item && styles.regionRowTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  topBtn: { padding: 12 },
  backText: { fontSize: 22, color: COLORS.text },
  cancelBtn: { padding: 12 },
  cancelText: { fontSize: 15, fontWeight: '600', color: COLORS.textMuted },
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 14,
  },
  field: { marginBottom: 18 },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  required: { color: COLORS.primary },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
  },
  inputText: { fontSize: 15, color: COLORS.text },
  placeholder: { color: COLORS.textPlaceholder },
  textArea: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
    minHeight: 140,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  counter: { fontSize: 12, color: COLORS.textMuted },
  error: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: COLORS.borderDark,
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalSheet: {
    maxHeight: '50%',
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
  regionRow: { paddingVertical: 14, paddingHorizontal: 24 },
  regionRowText: { fontSize: 15, color: COLORS.text },
  regionRowTextActive: { color: COLORS.primary, fontWeight: '800' },
});
