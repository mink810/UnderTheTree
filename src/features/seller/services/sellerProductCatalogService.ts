import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  SellerCatalogProduct,
  SellerProductKind,
  SellerProductRegistrationDraft,
} from '../types/seller-product-catalog.types';

const STORAGE_KEY = '@my-date-app/seller/product-catalog';

/** 구매자 Mock과 연동되는 대표 판매자 ID */
export const SELLER_CATALOG_OWNER_ID = '1';

function nowIso() {
  return new Date().toISOString();
}

async function readAll(): Promise<SellerCatalogProduct[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as SellerCatalogProduct[];
  } catch {
    return [];
  }
}

async function writeAll(products: SellerCatalogProduct[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export const sellerProductCatalogService = {
  async listBySeller(sellerId: string): Promise<SellerCatalogProduct[]> {
    const all = await readAll();
    return all
      .filter((p) => p.sellerId === sellerId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  async getRegisteredKinds(sellerId: string): Promise<SellerProductKind[]> {
    const list = await this.listBySeller(sellerId);
    return list.map((p) => p.kind);
  },

  async registerProduct(
    sellerId: string,
    draft: SellerProductRegistrationDraft
  ): Promise<SellerCatalogProduct> {
    if (!draft.kind) {
      throw new Error('KIND_REQUIRED');
    }

    const all = await readAll();
    const duplicate = all.some(
      (p) => p.sellerId === sellerId && p.kind === draft.kind
    );
    if (duplicate) {
      throw new Error('DUPLICATE_KIND');
    }

    const price = Number(draft.price.replace(/,/g, ''));
    const durationMinutes = Number(draft.durationMinutes);
    const timestamp = nowIso();
    const product: SellerCatalogProduct = {
      id: `${sellerId}-${draft.kind}-${Date.now()}`,
      sellerId,
      kind: draft.kind,
      name: draft.name.trim(),
      description: draft.description.trim(),
      price,
      durationMinutes,
      isActive: draft.isActive,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await writeAll([...all, product]);
    return product;
  },

  async listActiveForBuyer(sellerId: string): Promise<SellerCatalogProduct[]> {
    const list = await this.listBySeller(sellerId);
    return list.filter((p) => p.isActive);
  },

  async getById(productId: string): Promise<SellerCatalogProduct | undefined> {
    const all = await readAll();
    return all.find((p) => p.id === productId);
  },

  async updateProduct(
    productId: string,
    draft: SellerProductRegistrationDraft
  ): Promise<SellerCatalogProduct> {
    if (!draft.kind) {
      throw new Error('KIND_REQUIRED');
    }

    const all = await readAll();
    const index = all.findIndex((p) => p.id === productId);
    if (index < 0) {
      throw new Error('NOT_FOUND');
    }

    const existing = all[index];
    const duplicate = all.some(
      (p) =>
        p.id !== productId &&
        p.sellerId === existing.sellerId &&
        p.kind === draft.kind
    );
    if (duplicate) {
      throw new Error('DUPLICATE_KIND');
    }

    const price = Number(draft.price.replace(/,/g, ''));
    const durationMinutes = Number(draft.durationMinutes);
    const updated: SellerCatalogProduct = {
      ...existing,
      kind: draft.kind,
      name: draft.name.trim(),
      description: draft.description.trim(),
      price,
      durationMinutes,
      isActive: draft.isActive,
      updatedAt: nowIso(),
    };

    const next = [...all];
    next[index] = updated;
    await writeAll(next);
    return updated;
  },
};
