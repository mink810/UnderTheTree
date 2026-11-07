import { IdentityVerificationProviderId } from '../types/sellerOnboarding.types';

export type IdentityVerificationResult = {
  success: boolean;
  isAdult: boolean;
  provider: IdentityVerificationProviderId;
  /** 실제 연동 시 서버에서 발급·검증하는 CI/DI 등 (클라이언트 저장 금지) */
  verificationToken?: string;
  failureReason?: string;
};

export interface IdentityVerificationProvider {
  readonly id: IdentityVerificationProviderId;
  /** NICE·Danal 등: 보통 백엔드가 인증 URL을 내려주고 WebView/딥링크로 진행 */
  startVerification(): Promise<IdentityVerificationResult>;
}

const MOCK_DELAY_MS = 1400;

export const mockIdentityVerificationProvider: IdentityVerificationProvider =
  {
    id: 'mock',
    async startVerification() {
      await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
      return {
        success: true,
        isAdult: true,
        provider: 'mock',
        verificationToken: 'mock-token',
      };
    },
  };

/**
 * NICE평가정보 등 실제 연동 스텁.
 * - 업체와 계약·심사, 서비스 코드 발급
 * - 백엔드에서 CheckPlus/본인확인 URL 생성 → 앱 WebView 오픈
 * - 인증 완료 콜백을 서버가 수신 후 앱에 세션/토큰 전달
 * 클라이언트만으로는 구현·운영 불가.
 */
export const niceIdentityVerificationProvider: IdentityVerificationProvider = {
  id: 'nice',
  async startVerification() {
    return {
      success: false,
      isAdult: false,
      provider: 'nice',
      failureReason:
        'NICE 본인인증은 백엔드 연동 및 업체 계약 후 WebView 플로우로 연결해야 합니다.',
    };
  },
};

export function getIdentityVerificationProvider(
  id: IdentityVerificationProviderId
): IdentityVerificationProvider {
  switch (id) {
    case 'nice':
      return niceIdentityVerificationProvider;
    case 'danal':
      return mockIdentityVerificationProvider;
    case 'mock':
    default:
      return mockIdentityVerificationProvider;
  }
}
