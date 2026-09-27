import { Discount } from "@/types/product.types";

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Prefers the exact discount amount (set from WooCommerce's sale_price) over
// recomputing from a rounded percentage, so the displayed price always
// matches what's configured in WooCommerce.
export function getFinalPrice(price: number, discount: Discount): number {
  if (discount.amount > 0) {
    return price - discount.amount;
  }
  if (discount.percentage > 0) {
    return Math.round(price - (price * discount.percentage) / 100);
  }
  return price;
}
