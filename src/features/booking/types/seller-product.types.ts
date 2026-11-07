/** 확장 가능한 상품 유형 (신규 타입 추가 시 문자열로 확장) */
export type SellerProductType = 'PHONE' | 'COFFEE' | 'MEAL' | (string & {});

export interface SellerProduct {
  id: string;
  sellerId: string;
  type: SellerProductType;
  name: string;
  description: string;
  imageUrl: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
}
