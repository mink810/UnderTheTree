import { useRouter, type Href } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/colors';
import AuthRoundCheckbox from '@/features/auth/components/AuthRoundCheckbox';
import TermsDetailModal, {
  marketingTermsBody,
  privacyPolicyBody,
  serviceTermsBody,
} from '@/features/auth/components/TermsDetailModal';
import { authSessionService } from '@/features/auth/services/authSessionService';
import { authSignupService } from '@/features/auth/services/authSignupService';

/** COM-005 회원가입 */
export default function COM005Screen() {
  const router = useRouter();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [userIdVerified, setUserIdVerified] = useState(false);
  const [verifiedUserId, setVerifiedUserId] = useState('');
  const [userIdHint, setUserIdHint] = useState('');

  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState('');
  const [phoneHint, setPhoneHint] = useState('');

  const [serviceTerms, setServiceTerms] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const [checkingId, setCheckingId] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [termsModal, setTermsModal] = useState<{
    title: string;
    body: string;
  } | null>(null);

  const agreeAll = serviceTerms && privacyPolicy && marketing;

  const canSubmit = useMemo(() => {
    return (
      userId.trim().length > 0 &&
      password.length > 0 &&
      passwordConfirm.length > 0 &&
      email.trim().length > 0 &&
      phone.trim().length > 0 &&
      userIdVerified &&
      verifiedUserId === userId.trim() &&
      phoneVerified &&
      verifiedPhone.replace(/\D/g, '') === phone.replace(/\D/g, '') &&
      serviceTerms &&
      privacyPolicy
    );
  }, [
    userId,
    password,
    passwordConfirm,
    email,
    phone,
    userIdVerified,
    verifiedUserId,
    phoneVerified,
    verifiedPhone,
    serviceTerms,
    privacyPolicy,
  ]);

  const onUserIdChange = (value: string) => {
    setUserId(value);
    if (value.trim() !== verifiedUserId) {
      setUserIdVerified(false);
      setUserIdHint('');
    }
  };

  const onPhoneChange = (value: string) => {
    setPhone(value);
    const digits = value.replace(/\D/g, '');
    if (digits !== verifiedPhone.replace(/\D/g, '')) {
      setPhoneVerified(false);
      setPhoneHint('');
    }
  };

  const handleCheckId = async () => {
    setCheckingId(true);
    try {
      const result = await authSignupService.checkUserIdAvailability(userId);
      setUserIdHint(result.message);
      if (result.available) {
        setUserIdVerified(true);
        setVerifiedUserId(userId.trim());
      } else {
        setUserIdVerified(false);
        setVerifiedUserId('');
      }
    } finally {
      setCheckingId(false);
    }
  };

  const handleVerifyPhone = async () => {
    setVerifyingPhone(true);
    try {
      const result = await authSignupService.verifyPhone(phone);
      setPhoneHint(result.message);
      if (result.ok) {
        setPhoneVerified(true);
        setVerifiedPhone(phone.replace(/\D/g, ''));
      } else {
        setPhoneVerified(false);
        setVerifiedPhone('');
      }
    } finally {
      setVerifyingPhone(false);
    }
  };

  const toggleAgreeAll = () => {
    const next = !agreeAll;
    setServiceTerms(next);
    setPrivacyPolicy(next);
    setMarketing(next);
  };

  const handleSignUp = async () => {
    if (!canSubmit || submitting) {
      Alert.alert('안내', '필수 항목을 모두 입력·인증해 주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await authSignupService.signUp({
        userId,
        password,
        passwordConfirm,
        email,
        phone,
        phoneVerified,
        userIdVerified,
        agreements: { serviceTerms, privacyPolicy, marketing },
      });

      if (!result.ok) {
        Alert.alert('회원가입', result.message);
        return;
      }

      await authSessionService.saveSession({
        accessToken: result.accessToken,
        expiresAt: result.expiresAt,
        userId: result.userId,
      });

      Alert.alert('회원가입 완료', '환영합니다! 메인 홈으로 이동할게요.', [
        {
          text: '확인',
          onPress: () => router.replace('/home' as Href),
        },
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>←</Text>
          </Pressable>

          <Text style={styles.title}>회원가입</Text>
          <Text style={styles.subtitle}>
            서비스 이용을 위해 회원 정보를 입력해 주세요.
          </Text>

          <Text style={styles.label}>아이디</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.inputFlex]}
              value={userId}
              onChangeText={onUserIdChange}
              placeholder="아이디를 입력해 주세요."
              placeholderTextColor={COLORS.textPlaceholder}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable
              style={styles.inlineBtn}
              onPress={() => void handleCheckId()}
              disabled={checkingId}
            >
              {checkingId ? (
                <ActivityIndicator color={COLORS.primary} size="small" />
              ) : (
                <Text style={styles.inlineBtnText}>중복 확인</Text>
              )}
            </Pressable>
          </View>
          {userIdHint ? (
            <Text
              style={[
                styles.hint,
                userIdVerified ? styles.hintOk : styles.hintErr,
              ]}
            >
              {userIdHint}
            </Text>
          ) : null}

          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="비밀번호를 입력해 주세요."
            placeholderTextColor={COLORS.textPlaceholder}
            secureTextEntry
          />

          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            placeholder="비밀번호를 다시 입력해 주세요."
            placeholderTextColor={COLORS.textPlaceholder}
            secureTextEntry
          />

          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="이메일 주소를 입력해 주세요."
            placeholderTextColor={COLORS.textPlaceholder}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>휴대폰 번호</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.inputFlex]}
              value={phone}
              onChangeText={onPhoneChange}
              placeholder="휴대폰 번호를 입력해 주세요."
              placeholderTextColor={COLORS.textPlaceholder}
              keyboardType="phone-pad"
            />
            <Pressable
              style={styles.inlineBtn}
              onPress={() => void handleVerifyPhone()}
              disabled={verifyingPhone}
            >
              {verifyingPhone ? (
                <ActivityIndicator color={COLORS.primary} size="small" />
              ) : (
                <Text style={styles.inlineBtnText}>인증하기</Text>
              )}
            </Pressable>
          </View>
          {phoneHint ? (
            <Text
              style={[
                styles.hint,
                phoneVerified ? styles.hintOk : styles.hintErr,
              ]}
            >
              {phoneHint}
            </Text>
          ) : null}

          <Text style={styles.termsTitle}>약관 동의</Text>
          <View style={styles.termsBox}>
            <AuthRoundCheckbox
              checked={agreeAll}
              onPress={toggleAgreeAll}
              label="전체 약관 동의"
            />
            <View style={styles.termsDivider} />
            <AuthRoundCheckbox
              checked={serviceTerms}
              onPress={() => setServiceTerms((v) => !v)}
              label="[필수] 서비스 이용약관 동의"
              trailing={
                <Pressable
                  onPress={() =>
                    setTermsModal({
                      title: '서비스 이용약관',
                      body: serviceTermsBody(),
                    })
                  }
                >
                  <Text style={styles.termsLink}>보기</Text>
                </Pressable>
              }
            />
            <AuthRoundCheckbox
              checked={privacyPolicy}
              onPress={() => setPrivacyPolicy((v) => !v)}
              label="[필수] 개인정보 처리방침 동의"
              trailing={
                <Pressable
                  onPress={() =>
                    setTermsModal({
                      title: '개인정보 처리방침',
                      body: privacyPolicyBody(),
                    })
                  }
                >
                  <Text style={styles.termsLink}>보기</Text>
                </Pressable>
              }
            />
            <AuthRoundCheckbox
              checked={marketing}
              onPress={() => setMarketing((v) => !v)}
              label="[선택] 마케팅 정보 수신 동의"
              trailing={
                <Pressable
                  onPress={() =>
                    setTermsModal({
                      title: '마케팅 정보 수신',
                      body: marketingTermsBody(),
                    })
                  }
                >
                  <Text style={styles.termsLink}>보기</Text>
                </Pressable>
              }
            />
          </View>

          <Pressable
            style={[
              styles.submitBtn,
              canSubmit ? styles.submitActive : styles.submitDisabled,
            ]}
            disabled={!canSubmit || submitting}
            onPress={() => void handleSignUp()}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text
                style={[
                  styles.submitText,
                  !canSubmit && styles.submitTextDisabled,
                ]}
              >
                가입하기
              </Text>
            )}
          </Pressable>

          <Pressable
            style={styles.loginLinkBtn}
            onPress={() => router.replace('/login' as Href)}
          >
            <Text style={styles.loginLinkText}>로그인하기</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      {termsModal ? (
        <TermsDetailModal
          visible
          title={termsModal.title}
          body={termsModal.body}
          onClose={() => setTermsModal(null)}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.surfaceMuted },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  back: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  backText: {
    fontSize: 22,
    color: COLORS.text,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 4,
  },
  inputFlex: {
    flex: 1,
    marginBottom: 0,
  },
  inlineBtn: {
    minWidth: 88,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  hint: {
    fontSize: 12,
    marginBottom: 6,
    marginTop: 4,
  },
  hintOk: { color: COLORS.success },
  hintErr: { color: COLORS.primary },
  termsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 4,
  },
  termsBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  termsDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 4,
  },
  termsLink: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    textDecorationLine: 'underline',
  },
  submitBtn: {
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitActive: {
    backgroundColor: COLORS.primary,
  },
  submitDisabled: {
    backgroundColor: COLORS.border,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
  submitTextDisabled: {
    color: COLORS.textMuted,
  },
  loginLinkBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  loginLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
});
