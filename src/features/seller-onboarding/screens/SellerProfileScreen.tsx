import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { COLORS } from '@/constants/colors';

import SellerOnboardingFlowStepper from '../components/SellerOnboardingFlowStepper';
import SellerProfileForm from '../components/SellerProfileForm';
import { PROFILE_FLOW_STEPS } from '../data/sellerOnboarding.mock';
import { useSellerBasicInfo } from '../hooks/useSellerBasicInfo';

export default function SellerOnboardingProfileScreen() {
  const insets = useSafeAreaInsets();
  const {
    loading,
    submitting,
    canAccess,
    verifiedName,
    ageLabel,
    draft,
    updateDraft,
    fieldErrors,
    canProceed,
    submit,
    goBackToVerification,
  } = useSellerBasicInfo();

  const bottomPad = 88 + insets.bottom;

  if (loading || !canAccess) {
    return (
      <SafeAreaView style={styles.centered} edges={['top']}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={goBackToVerification}
          style={styles.headerSide}
          hitSlop={8}
        >
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>판매자 정보 입력</Text>
        <View style={styles.headerSide} />
      </View>

      <SellerOnboardingFlowStepper
        steps={PROFILE_FLOW_STEPS}
        currentStepId="profile"
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: bottomPad + 16 }}
        >
          <SellerProfileForm
            verifiedName={verifiedName}
            ageLabel={ageLabel}
            draft={draft}
            errors={fieldErrors}
            onChange={updateDraft}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            !canProceed && styles.primaryButtonDisabled,
            pressed && canProceed && styles.primaryButtonPressed,
          ]}
          onPress={submit}
          disabled={!canProceed || submitting}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text
              style={[
                styles.primaryButtonText,
                !canProceed && styles.primaryButtonTextDisabled,
              ]}
            >
              다음
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  headerSide: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: COLORS.text,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: COLORS.surfaceGray,
  },
  primaryButtonPressed: {
    opacity: 0.92,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  primaryButtonTextDisabled: {
    color: COLORS.textSubtle,
  },
});
