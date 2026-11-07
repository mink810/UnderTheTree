import { useEffect, useState } from 'react';
import { sellerService } from '../services/sellerService';
import { Seller } from '../types/seller.types';

export function useSellers() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    sellerService.getSellers()
      .then((data) => {
        if (mounted) setSellers(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { sellers, loading };
}
