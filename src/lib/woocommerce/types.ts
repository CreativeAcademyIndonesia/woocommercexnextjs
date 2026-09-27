export type WooImage = {
  id: number;
  src: string;
  alt?: string;
};

export type WooCategory = {
  id: number;
  name: string;
  slug: string;
};

export type WooProduct = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  average_rating: string;
  rating_count: number;
  stock_status: "instock" | "outofstock" | "onbackorder";
  images: WooImage[];
  categories: WooCategory[];
  related_ids: number[];
};
