import { MOCK_MEMBERS } from '../data/loginUsers.mock';
import { LoginFailure, LoginResult } from '../types/login.types';

import { memberRegistryService } from './memberRegistryService';

const SIMULATE_NETWORK_ERROR = false;
const MAX_CONSECUTIVE_FAILURES = 5;

let consecutiveFailures = 0;

function failure(
  code: LoginFailure['code'],
  message: string
): LoginFailure {
  return { ok: false, code, message };
}

export const authLoginService = {
  resetFailureCount(): void {
    consecutiveFailures = 0;
  },

  async signIn(userId: string, password: string): Promise<LoginResult> {
    const id = userId.trim();
    const pw = password;

    if (!id) {
      return failure('EMPTY_USER_ID', '아이디를 입력해 주세요.');
    }
    if (!pw) {
      return failure('EMPTY_PASSWORD', '비밀번호를 입력해 주세요.');
    }

    if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
      return failure(
        'RATE_LIMITED',
        '로그인 시도가 여러 번 실패했어요. 잠시 후 다시 시도해 주세요.'
      );
    }

    if (SIMULATE_NETWORK_ERROR) {
      return failure(
        'NETWORK_ERROR',
        '네트워크에 연결할 수 없어요. 연결 상태를 확인한 뒤 다시 시도해 주세요.'
      );
    }

    await new Promise((r) => setTimeout(r, 400));

    const mockMember = MOCK_MEMBERS.find(
      (m) => m.userId.toLowerCase() === id.toLowerCase()
    );
    const registered = await memberRegistryService.findForLogin(id, pw);
    const member = mockMember ?? registered;

    if (!member || member.password !== pw) {
      consecutiveFailures += 1;
      return failure(
        'INVALID_CREDENTIALS',
        '아이디 또는 비밀번호가 일치하지 않아요.'
      );
    }

    if (member.status === 'withdrawn') {
      consecutiveFailures += 1;
      return failure(
        'WITHDRAWN',
        '탈퇴한 회원은 로그인할 수 없어요.'
      );
    }

    if (member.status === 'suspended') {
      consecutiveFailures += 1;
      const reason =
        'suspendReason' in member && member.suspendReason
          ? member.suspendReason
          : '이용이 정지된 계정이에요. 고객센터로 문의해 주세요.';
      return failure('SUSPENDED', reason);
    }

    consecutiveFailures = 0;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);

    return {
      ok: true,
      userId: member.userId,
      accessToken: `mock-${member.userId}-${Date.now()}`,
      expiresAt: expiresAt.toISOString(),
    };
  },
};
