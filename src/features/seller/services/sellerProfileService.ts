import { sellerService } from './sellerService';
import { SellerProfile } from '../types/seller-profile.types';
import { getMockProfileData } from '../data/sellerProfile.mock';

export const sellerProfileService = {
  async getProfile(
    sellerId: string
  ): Promise<SellerProfile | null> {
    const seller = await sellerService.getSellerById(sellerId);

    if (!seller) {
      return null;
    }

    const profileData = getMockProfileData(sellerId);

    return {
      sellerId: seller.id,
      ...profileData,
      products: seller.products,
      rating: seller.rating,
      reviewCount: seller.reviewCount,
    };
  },
};
