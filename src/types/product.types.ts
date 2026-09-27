export type Discount = {
  amount: number;
  percentage: number;
};

export type Product = {
  id: number;
  slug?: string;
  title: string;
  srcUrl: string;
  gallery?: string[];
  price: number;
  discount: Discount;
  rating: number;
  description?: string;
  categories?: string[];
  inStock?: boolean;
};
