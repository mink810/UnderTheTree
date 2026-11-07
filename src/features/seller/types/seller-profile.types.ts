import { DateProduct } from './seller.types';

export interface SellerVerification {
  identityVerified: boolean;
  adultVerified: boolean;
  sellerApproved: boolean;
}

export interface SellerReview {
  id: string;
  reviewerNickname: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface SellerSnsLinks {
  instagram?: string;
  youtube?: string;
}

export interface SellerProfile {
  sellerId: string;
  photos: string[];
  height?: number;

  introduction: string;

  personalityTags: string[];
  hashtags: string[];
  interests: string[];

  favoriteThings?: string;
  thingsDisliked?: string;
  dateStyle?: string;
  idealDate?: string;

  snsLinks: SellerSnsLinks;
  verification: SellerVerification;

  // 기본 판매자 데이터의 상품을 재사용
  products: DateProduct[];

  rating: number;
  reviewCount: number;
  reviews: SellerReview[];
}
