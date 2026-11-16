import type { Href } from 'expo-router';

type BackableRouter = {
  canGoBack: () => boolean;
  back: () => void;
  replace: (href: Href) => void;
};

/** 스택이 없을 때 뒤로가기 오류 방지 */
export function goBackOrReplace(router: BackableRouter, fallbackHref: Href): void {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace(fallbackHref);
}