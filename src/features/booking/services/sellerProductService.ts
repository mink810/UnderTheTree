import { MOCK_SELLER_PRODUCTS } from '../data/sellerProduct.mock';
import { SellerProduct } from '../types/seller-product.types';

export const sellerProductService = {
  async getActiveProductsBySellerId(
    sellerId: string
  ): Promise<SellerProduct[]> {
    return Promise.resolve(
      MOCK_SELLER_PRODUCTS.filter(
        (product) => product.sellerId === sellerId && product.isActive
      )
    );
  },

  async getProductById(productId: string): Promise<SellerProduct | undefined> {
    return Promise.resolve(
      MOCK_SELLER_PRODUCTS.find(
        (product) => product.id === productId && product.isActive
      )
    );
  },
};
