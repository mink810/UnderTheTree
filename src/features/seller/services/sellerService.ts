import { MOCK_SELLERS } from '../data/seller.mock';
import { Seller } from '../types/seller.types';

export const sellerService = {
  async getSellers(): Promise<Seller[]> {
    return Promise.resolve(MOCK_SELLERS);
  },

  async getSellerById(id: string): Promise<Seller | undefined> {
    return Promise.resolve(
      MOCK_SELLERS.find((seller) => seller.id === id)
    );
  },
};
