import { SellerProductKind } from '../types/seller-product-catalog.types';

export type ProductKindOption = {
  kind: SellerProductKind;
  title: string;
  subtitle: string;
  icon: string;
  defaultPrice: number;
  defaultDurationMinutes: number;
  defaultName: string;
};

export const SELLER_PRODUCT_KIND_OPTIONS: ProductKindOption[] = [
  {
    kind: 'PHONE',
    title: '전화데이트',
    subtitle: '전화로 만나요',
    icon: '📞',
    defaultPrice: 10_000,
    defaultDurationMinutes: 30,
    defaultName: '전화데이트',
  },
  {
    kind: 'COFFEE',
    title: '커피데이트',
    subtitle: '카페에서 만나요',
    icon: '☕',
    defaultPrice: 50_000,
    defaultDurationMinutes: 60,
    defaultName: '커피데이트',
  },
  {
    kind: 'MEAL',
    title: '식사데이트',
    subtitle: '함께 식사해요',
    icon: '🍽️',
    defaultPrice: 100_000,
    defaultDurationMinutes: 90,
    defaultName: '식사데이트',
  },
];

export function getProductKindOption(
  kind: SellerProductKind
): ProductKindOption | undefined {
  return SELLER_PRODUCT_KIND_OPTIONS.find((o) => o.kind === kind);
}
