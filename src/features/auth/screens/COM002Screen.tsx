import { useFocusEffect, useRouter, type Href } from 'expo-router';
import React, { useCallback, useState } from 'react';
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

import { BRAND } from '@/constants/brand';
import { COLORS } from '@/constants/colors';
import AppBrandLogo from '@/features/common/components/AppBrandLogo';

import { authLoginService } from '../services/authLoginService';
import { authSessionService } from '../services/authSessionService';
import { loginCredentialsService } from '../services/loginCredentialsService';

/** COM-002 로그인 */
export default function COM002Screen() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [saveUserId, setSaveUserId] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const saved = await loginCredentialsService.getSavedUserId();
        if (!active) {
          return;
        }
        if (saved) {
          setUserId(saved);
          setSaveUserId(true);
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  const canSubmit = userId.trim().length > 0 && password.length > 0;

  const handleLogin = async () => {
    if (!canSubmit || submitting) {
      if (!userId.trim()) {
        Alert.alert('안내', '아이디를 입력해 주세요.');
      } else if (!password) {
        Alert.alert('안내', '비밀번호를 입력해 주세요.');
      }
      return;
    }

    setSubmitting(true);
    try {
      const result = await authLoginService.signIn(userId, password);
      if (!result.ok) {
        Alert.alert('로그인 실패', result.message);
        return;
      }

      await authSessionService.saveSession({
        accessToken: result.accessToken,
        expiresAt: result.expiresAt,
        userId: result.userId,
      });

      if (saveUserId) {
        await loginCredentialsService.persistSavedUserId(userId.trim());
      } else {
        await loginCredentialsService.persistSavedUserId(null);
      }

      router.replace('/home' as Href);
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
          <View style={styles.header}>
            <AppBrandLogo size={76} />
            <Text style={styles.brandName}>{BRAND.name}</Text>
            <Text style={styles.slogan}>{BRAND.loginSlogan}</Text>
          </View>

          <Text style={styles.label}>아이디</Text>
          <TextInput
            style={styles.input}
            value={userId}
            onChangeText={setUserId}
            placeholder="아이디를 입력해 주세요."
            placeholderTextColor={COLORS.textPlaceholder}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="username"
          />

          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="비밀번호를 입력해 주세요."
            placeholderTextColor={COLORS.textPlaceholder}
            secureTextEntry
            textContentType="password"
          />

          <View style={styles.optionsRow}>
            <Pressable
              style={styles.saveRow}
              onPress={() => setSaveUserId((v) => !v)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: saveUserId }}
            >
              <View style={[styles.checkbox, saveUserId && styles.checkboxOn]}>
                {saveUserId ? <Text style={styles.checkMark}>✓</Text> : null}
              </View>
              <Text style={styles.saveLabel}>아이디 저장</Text>
            </Pressable>

            <View style={styles.linkRow}>
              <Pressable onPress={() => router.push('/find-id' as Href)}>
                <Text style={styles.link}>아이디 찾기</Text>
              </Pressable>
              <Text style={styles.linkDot}> · </Text>
              <Pressable onPress={() => router.push('/find-password' as Href)}>
                <Text style={styles.link}>비밀번호 찾기</Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            style={[
              styles.loginBtn,
              canSubmit ? styles.loginBtnActive : styles.loginBtnDisabled,
            ]}
            disabled={!canSubmit || submitting}
            onPress={() => void handleLogin()}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text
                style={[
                  styles.loginBtnText,
                  !canSubmit && styles.loginBtnTextDisabled,
                ]}
              >
                로그인
              </Text>
            )}
          </Pressable>

          <Text style={styles.signUpHint}>아직 회원이 아니신가요?</Text>
          <Pressable
            style={styles.signUpBtn}
            onPress={() => router.push('/sign-up' as Href)}
          >
            <Text style={styles.signUpBtnText}>회원가입</Text>
          </Pressable>

          {__DEV__ ? (
            <>
              <Text style={styles.devHint}>
                개발용 계정: demo / demo1234
              </Text>
              <Pressable
                style={styles.clearSessionBtn}
                onPress={async () => {
                  await authSessionService.signOut();
                  Alert.alert('안내', '저장된 로그인 세션을 지웠어요.');
                }}
              >
                <Text style={styles.clearSessionText}>
                  저장된 로그인 세션 지우기
                </Text>
              </Pressable>
            </>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.surfaceMuted },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandName: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  slogan: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 8,
    marginTop: 4,
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
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 12,
  },
  saveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  checkboxOn: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  checkMark: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  saveLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  linkDot: {
    fontSize: 12,
    color: COLORS.textPlaceholder,
  },
  loginBtn: {
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 28,
  },
  loginBtnActive: {
    backgroundColor: COLORS.primary,
  },
  loginBtnDisabled: {
    backgroundColor: COLORS.border,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
  loginBtnTextDisabled: {
    color: COLORS.textMuted,
  },
  signUpHint: {
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  signUpBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  signUpBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  devHint: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textPlaceholder,
  },
  clearSessionBtn: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  clearSessionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    textDecorationLine: 'underline',
  },
});
