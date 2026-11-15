import { SellerProduct } from '@/features/booking/types/seller-product.types';

import { getProductKindOption } from '../constants/sellerProductKinds';
import { SellerCatalogProduct } from '../types/seller-product-catalog.types';

const KIND_IMAGE: Record<SellerCatalogProduct['kind'], string> = {
  PHONE:
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900',
  COFFEE:
    'https://images.unsplash.com/photo-1511920170033-f8396924c10b?w=900',
  MEAL:
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900',
};

export function mapCatalogProductToBooking(
  product: SellerCatalogProduct
): SellerProduct {
  return {
    id: product.id,
    sellerId: product.sellerId,
    type: product.kind,
    name: product.name,
    description: product.description,
    imageUrl: KIND_IMAGE[product.kind],
    durationMinutes: product.durationMinutes,
    price: product.price,
    isActive: product.isActive,
  };
}

export function defaultDisplayName(kind: SellerCatalogProduct['kind']): string {
  return getProductKindOption(kind)?.title ?? kind;
}
