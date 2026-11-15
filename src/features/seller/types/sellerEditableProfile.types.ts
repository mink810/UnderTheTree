export interface SellerEditableProfile {
  photos: string[];
  mainPhotoUri: string | null;
  name: string;
  age: string;
  region: string;
  heightCm: string;
  favoriteThings: string;
  mbti: string | null;
  introduction: string;
}

export type SellerProfileEditFieldErrors = Partial<
  Record<
    | 'photos'
    | 'mainPhotoUri'
    | 'name'
    | 'age'
    | 'region'
    | 'heightCm'
    | 'introduction'
    | 'global',
    string
  >
>;
