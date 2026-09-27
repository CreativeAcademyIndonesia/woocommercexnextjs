import { wooCommerce } from "./client";
import type { WooCategory, WooProduct } from "./types";
import type { Product } from "@/types/product.types";

const FALLBACK_IMAGE = "/images/pic1.png";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function mapWooProductToProduct(wooProduct: WooProduct): Product {
  const regularPrice = parseFloat(
    wooProduct.regular_price || wooProduct.price || "0"
  );
  const salePrice = wooProduct.sale_price
    ? parseFloat(wooProduct.sale_price)
    : null;

  const hasDiscount =
    wooProduct.on_sale && salePrice !== null && salePrice < regularPrice;
  // Use the exact rupiah difference so the displayed sale price always
  // matches WooCommerce's sale_price instead of a value re-derived from a
  // rounded percentage. The percentage is kept only for the "-x%" badge.
  const discountAmount = hasDiscount ? regularPrice - salePrice! : 0;
  const percentage = hasDiscount
    ? Math.round((discountAmount / regularPrice) * 100)
    : 0;

  const images = wooProduct.images?.map((image) => image.src) ?? [];

  return {
    id: wooProduct.id,
    slug: wooProduct.slug,
    title: wooProduct.name,
    srcUrl: images[0] ?? FALLBACK_IMAGE,
    gallery: images.length > 0 ? images : [FALLBACK_IMAGE],
    price: regularPrice,
    discount: {
      amount: discountAmount,
      percentage,
    },
    rating: parseFloat(wooProduct.average_rating || "0"),
    description: stripHtml(
      wooProduct.description || wooProduct.short_description || ""
    ),
    categories: wooProduct.categories?.map((category) => category.name) ?? [],
    inStock: wooProduct.stock_status === "instock",
  };
}

export type GetProductsParams = {
  page?: number;
  perPage?: number;
  category?: number;
  search?: string;
  orderby?: "date" | "popularity" | "price" | "rating" | "title";
  order?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
};

export type GetProductsResult = {
  products: Product[];
  total: number;
  totalPages: number;
};

export async function getProducts(
  params: GetProductsParams = {}
): Promise<GetProductsResult> {
  const response = await wooCommerce.get("products", {
    status: "publish",
    page: params.page ?? 1,
    per_page: params.perPage ?? 12,
    category: params.category,
    search: params.search,
    orderby: params.orderby ?? "date",
    order: params.order ?? "desc",
    min_price: params.minPrice,
    max_price: params.maxPrice,
  });

  const products = (response.data as WooProduct[]).map(mapWooProductToProduct);

  return {
    products,
    total: Number(response.headers["x-wp-total"] ?? products.length),
    totalPages: Number(response.headers["x-wp-totalpages"] ?? 1),
  };
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    const response = await wooCommerce.get(`products/${id}`);
    return mapWooProductToProduct(response.data as WooProduct);
  } catch {
    return null;
  }
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const wooProductResponse = await wooCommerce.get(`products/${product.id}`);
  const relatedIds: number[] = (wooProductResponse.data as WooProduct)
    .related_ids;

  if (!relatedIds || relatedIds.length === 0) {
    return [];
  }

  const response = await wooCommerce.get("products", {
    include: relatedIds.slice(0, limit).join(","),
  });

  return (response.data as WooProduct[]).map(mapWooProductToProduct);
}

export async function getCategoryIdBySlug(
  slug: string
): Promise<number | null> {
  const response = await wooCommerce.get("products/categories", {
    slug,
  });
  const categories = response.data as WooCategory[];
  return categories[0]?.id ?? null;
}
