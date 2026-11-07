export interface Review {
  id: string;
  bookingId: string;
  sellerId: string;
  buyerId: string;
  rating: number;
  tags: string[];
  content: string;
  images: string[];
  createdAt: string;
}

export interface CreateReviewInput {
  bookingId: string;
  sellerId: string;
  buyerId: string;
  rating: number;
  tags: string[];
  content: string;
  images: string[];
}
