import type { Href } from 'expo-router';

import { authSessionService } from './authSessionService';

export type BootstrapSuccess = {
  kind: 'success';
  nextHref: Href;
};

export type BootstrapForceUpdate = {
  kind: 'force_update';
};

export type BootstrapError = {
  kind: 'error';
  code: 'INIT_FAILED' | 'NETWORK_REQUIRED';
  message: string;
};

export type BootstrapResult =
  | BootstrapSuccess
  | BootstrapForceUpdate
  | BootstrapError;

const FORCE_UPDATE_REQUIRED = false;

const MIN_SPLASH_DISPLAY_MS = 1400;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * 앱 초기 구동: 스토리지 워밍업, 세션 정리, 이동 경로 결정
 */
export async function runAppBootstrap(): Promise<BootstrapResult> {
  const startedAt = Date.now();

  try {
    await authSessionService.warmUp();
    await authSessionService.clearInvalidSessions();

    if (FORCE_UPDATE_REQUIRED) {
      await delayRemainingSplash(startedAt);
      return { kind: 'force_update' };
    }

    await delayRemainingSplash(startedAt);

    /** 임시: 스플래시 직후 테스트 진입 화면 (운영 시 세션 분기로 복구) */
    return { kind: 'success', nextHref: '/test-entry' };
  } catch {
    await delayRemainingSplash(startedAt);
    return {
      kind: 'error',
      code: 'INIT_FAILED',
      message: '앱을 시작하지 못했어요. 다시 시도해 주세요.',
    };
  }
}

async function delayRemainingSplash(startedAt: number): Promise<void> {
  const elapsed = Date.now() - startedAt;
  const remaining = MIN_SPLASH_DISPLAY_MS - elapsed;
  if (remaining > 0) {
    await delay(remaining);
  }
}
