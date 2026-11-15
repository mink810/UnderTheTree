export type SellerProductKind = 'PHONE' | 'COFFEE' | 'MEAL';

export interface SellerCatalogProduct {
  id: string;
  sellerId: string;
  kind: SellerProductKind;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SellerProductRegistrationDraft = {
  kind: SellerProductKind | null;
  name: string;
  description: string;
  price: string;
  durationMinutes: string;
  isActive: boolean;
};

export type SellerProductRegistrationErrors = Partial<
  Record<
    | 'kind'
    | 'name'
    | 'description'
    | 'price'
    | 'durationMinutes'
    | 'duplicate'
    | 'global',
    string
  >
>;
