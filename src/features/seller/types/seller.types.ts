export type DateProduct = {
  type: 'phone' | 'coffee' | 'meal';
  name: string;
  price: number;
};

export type Seller = {
  id: string;
  nickname: string;
  age: number;
  region: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  products: DateProduct[];
  isAd: boolean;
  isNew: boolean;
  recommendationScore: number;
  popularityScore: number;
  createdAt: string;
};
