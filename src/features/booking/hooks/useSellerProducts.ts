import { useEffect, useState } from 'react';
import { sellerProductService } from '../services/sellerProductService';
import { SellerProduct } from '../types/seller-product.types';

export function useSellerProducts(sellerId: string | undefined) {
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (!sellerId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    sellerProductService
      .getActiveProductsBySellerId(sellerId)
      .then((data) => {
        if (mounted) {
          setProducts(data);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [sellerId]);

  return { products, loading };
}
