import {
  SignUpErrorCode,
  SignUpPayload,
  SignUpResult,
} from '../types/signup.types';
import { RegisteredMember } from '../types/registeredMember.types';
import {
  isValidEmail,
  isValidPassword,
  isValidPhoneDigits,
  normalizePhone,
  passwordPolicyMessage,
} from '../utils/signupValidation';

import { memberRegistryService } from './memberRegistryService';

function fail(code: SignUpErrorCode, message: string): SignUpResult {
  return { ok: false, code, message };
}

export const authSignupService = {
  async checkUserIdAvailability(
    userId: string
  ): Promise<{ available: boolean; message: string }> {
    const id = userId.trim();
    if (!id) {
      return { available: false, message: '아이디를 입력해 주세요.' };
    }
    if (id.length < 4) {
      return {
        available: false,
        message: '아이디는 4자 이상 입력해 주세요.',
      };
    }
    await new Promise((r) => setTimeout(r, 300));
    const taken = await memberRegistryService.isUserIdTaken(id);
    if (taken) {
      return {
        available: false,
        message: '이미 사용 중인 아이디예요.',
      };
    }
    return { available: true, message: '사용 가능한 아이디예요.' };
  },

  async verifyPhone(phone: string): Promise<{ ok: boolean; message: string }> {
    const digits = normalizePhone(phone);
    if (!isValidPhoneDigits(digits)) {
      return {
        ok: false,
        message: '올바른 휴대폰 번호를 입력해 주세요.',
      };
    }
    const taken = await memberRegistryService.isPhoneTaken(digits);
    if (taken) {
      return {
        ok: false,
        message: '이미 가입된 휴대폰 번호예요.',
      };
    }
    await new Promise((r) => setTimeout(r, 500));
    return { ok: true, message: '본인인증이 완료되었어요.' };
  },

  async signUp(payload: SignUpPayload): Promise<SignUpResult> {
    const userId = payload.userId.trim();
    const email = payload.email.trim();
    const phone = normalizePhone(payload.phone);

    if (!userId) {
      return fail('EMPTY_USER_ID', '아이디를 입력해 주세요.');
    }
    if (!payload.userIdVerified) {
      return fail('USER_ID_NOT_CHECKED', '아이디 중복 확인을 해 주세요.');
    }
    if (await memberRegistryService.isUserIdTaken(userId)) {
      return fail('USER_ID_TAKEN', '이미 사용 중인 아이디예요.');
    }
    if (!isValidPassword(payload.password)) {
      return fail('INVALID_PASSWORD', passwordPolicyMessage());
    }
    if (payload.password !== payload.passwordConfirm) {
      return fail('PASSWORD_MISMATCH', '비밀번호가 일치하지 않아요.');
    }
    if (!isValidEmail(email)) {
      return fail('INVALID_EMAIL', '이메일 형식을 확인해 주세요.');
    }
    if (!isValidPhoneDigits(phone)) {
      return fail('INVALID_PHONE', '올바른 휴대폰 번호를 입력해 주세요.');
    }
    if (!payload.phoneVerified) {
      return fail('PHONE_NOT_VERIFIED', '휴대폰 본인인증을 완료해 주세요.');
    }
    if (await memberRegistryService.isPhoneTaken(phone)) {
      return fail('PHONE_ALREADY_USED', '이미 가입된 휴대폰 번호예요.');
    }
    if (!payload.agreements.serviceTerms || !payload.agreements.privacyPolicy) {
      return fail('TERMS_REQUIRED', '필수 약관에 동의해 주세요.');
    }

    try {
      const timestamp = new Date().toISOString();
      const member: RegisteredMember = {
        userId,
        password: payload.password,
        email,
        phone,
        marketingOptIn: payload.agreements.marketing,
        status: 'active',
        createdAt: timestamp,
      };
      await memberRegistryService.register(member);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 14);

      return {
        ok: true,
        userId,
        accessToken: `mock-${userId}-${Date.now()}`,
        expiresAt: expiresAt.toISOString(),
      };
    } catch {
      return fail(
        'SERVER_ERROR',
        '회원가입에 실패했어요. 잠시 후 다시 시도해 주세요.'
      );
    }
  },
};
