import { sellerProductCatalogService } from '@/features/seller/services/sellerProductCatalogService';
import { mapCatalogProductToBooking } from '@/features/seller/utils/catalogToBookingProduct';

import { MOCK_SELLER_PRODUCTS } from '../data/sellerProduct.mock';
import { SellerProduct } from '../types/seller-product.types';

function mockActiveBySeller(sellerId: string): SellerProduct[] {
  return MOCK_SELLER_PRODUCTS.filter(
    (product) => product.sellerId === sellerId && product.isActive
  );
}

export const sellerProductService = {
  async getActiveProductsBySellerId(
    sellerId: string
  ): Promise<SellerProduct[]> {
    const catalog = await sellerProductCatalogService.listActiveForBuyer(
      sellerId
    );

    if (catalog.length > 0) {
      return catalog.map(mapCatalogProductToBooking);
    }

    return Promise.resolve(mockActiveBySeller(sellerId));
  },

  async getProductById(productId: string): Promise<SellerProduct | undefined> {
    const fromCatalog = await sellerProductCatalogService.getById(productId);
    if (fromCatalog?.isActive) {
      return mapCatalogProductToBooking(fromCatalog);
    }

    return Promise.resolve(
      MOCK_SELLER_PRODUCTS.find(
        (product) => product.id === productId && product.isActive
      )
    );
  },
};
