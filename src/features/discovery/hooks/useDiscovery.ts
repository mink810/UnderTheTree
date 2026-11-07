import { useMemo, useState } from 'react';
import { Seller } from '../../seller/types/seller.types';

export type SortType = '추천순' | '최신순' | '인기순' | '평점순';

export function useDiscovery(sellers: Seller[]) {
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [minAge, setMinAge] = useState(20);
  const [maxAge, setMaxAge] = useState(39);
  const [sortType, setSortType] = useState<SortType>('추천순');
  const [keyword, setKeyword] = useState('');

  const filteredSellers = useMemo(() => {
    const result = sellers.filter((seller) => {
      const regionMatch =
        selectedRegion === '전체' || seller.region === selectedRegion;

      const ageMatch =
        seller.age >= minAge && seller.age <= maxAge;

      const keywordMatch =
        !keyword.trim() ||
        seller.nickname.toLowerCase().includes(keyword.trim().toLowerCase());

      return regionMatch && ageMatch && keywordMatch;
    });

    return [...result].sort((a, b) => {
      switch (sortType) {
        case '최신순':
          return b.createdAt.localeCompare(a.createdAt);
        case '인기순':
          return b.popularityScore - a.popularityScore;
        case '평점순':
          return b.rating - a.rating;
        default:
          return b.recommendationScore - a.recommendationScore;
      }
    });
  }, [sellers, selectedRegion, minAge, maxAge, sortType, keyword]);

  return {
    selectedRegion,
    setSelectedRegion,
    minAge,
    setMinAge,
    maxAge,
    setMaxAge,
    sortType,
    setSortType,
    keyword,
    setKeyword,
    filteredSellers,
  };
}
