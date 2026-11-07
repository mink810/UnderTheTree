import { MOCK_SELLERS } from '../../seller/data/seller.mock';
import { DateProduct } from '../../seller/types/seller.types';
import { SellerProduct, SellerProductType } from '../types/seller-product.types';

const TYPE_TO_PRODUCT: Record<
  DateProduct['type'],
  {
    type: SellerProductType;
    description: string;
    durationMinutes: number;
    imageUrl: string;
  }
> = {
  phone: {
    type: 'PHONE',
    description: '편안하게 목소리로 이야기를 나누는 시간',
    durationMinutes: 30,
    imageUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900',
  },
  coffee: {
    type: 'COFFEE',
    description: '카페에서 여유롭게 대화하며 서로를 알아가는 시간',
    durationMinutes: 60,
    imageUrl:
      'https://images.unsplash.com/photo-1511920170033-f8396924c10b?w=900',
  },
  meal: {
    type: 'MEAL',
    description: '함께 식사하며 여유롭게 대화하는 시간',
    durationMinutes: 90,
    imageUrl:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900',
  },
};

function buildProductsFromSellers(): SellerProduct[] {
  const items: SellerProduct[] = [];

  for (const seller of MOCK_SELLERS) {
    for (const product of seller.products) {
      const meta = TYPE_TO_PRODUCT[product.type];

      items.push({
        id: `${seller.id}-${product.type}`,
        sellerId: seller.id,
        type: meta.type,
        name: product.name.replace(/\s/g, ''),
        description: meta.description,
        imageUrl: meta.imageUrl,
        durationMinutes: meta.durationMinutes,
        price: product.price,
        isActive: true,
      });
    }
  }

  // 비활성 상품 샘플 (목록 API에서 필터링 검증용)
  items.push({
    id: '1-phone-archived',
    sellerId: '1',
    type: 'PHONE',
    name: '전화데이트(종료)',
    description: '더 이상 제공하지 않는 상품',
    imageUrl: TYPE_TO_PRODUCT.phone.imageUrl,
    durationMinutes: 30,
    price: 5000,
    isActive: false,
  });

  return items;
}

export const MOCK_SELLER_PRODUCTS: SellerProduct[] = buildProductsFromSellers();

/** 판매자별 상세 지역 (Mock) */
export const MOCK_SELLER_AREA: Record<string, string> = {
  '1': '서울 강남구',
  '2': '경기 성남시',
  '3': '서울 마포구',
  '4': '인천 연수구',
  '5': '부산 해운대구',
  '6': '서울 송파구',
  '7': '대전 유성구',
  '8': '경기 수원시',
  '9': '서울 종로구',
  '10': '광주 북구',
  '11': '인천 남동구',
  '12': '서울 용산구',
};
