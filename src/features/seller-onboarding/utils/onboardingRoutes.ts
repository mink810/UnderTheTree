import { SellerApplicationStatus } from '../types/sellerOnboarding.types';

export type SellerOnboardingRoute =
  | '/seller-onboarding/profile'
  | '/seller-onboarding/verification'
  | '/seller-onboarding/application'
  | '/seller-onboarding/additional-verification'
  | '/seller-onboarding/status'
  | '/seller-onboarding/complete';

export function getRouteForApplicationStatus(
  status: SellerApplicationStatus
): SellerOnboardingRoute | null {
  switch (status) {
    case 'NOT_APPLIED':
      return null;
    case 'PENDING':
    case 'NEED_MORE_INFO':
    case 'REJECTED':
      return '/seller-onboarding/status';
    case 'APPROVED':
      return '/seller-onboarding/complete';
    default:
      return null;
  }
}

export function canStartNewApplication(
  status: SellerApplicationStatus
): boolean {
  return status === 'NOT_APPLIED';
}
