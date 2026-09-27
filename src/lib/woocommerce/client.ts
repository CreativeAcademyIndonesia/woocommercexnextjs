import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const url = process.env.WOOCOMMERCE_URL;
const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

if (!url || !consumerKey || !consumerSecret) {
  throw new Error(
    "Missing WooCommerce environment variables. Set WOOCOMMERCE_URL, WOOCOMMERCE_CONSUMER_KEY and WOOCOMMERCE_CONSUMER_SECRET in .env.local"
  );
}

// Server-only client. Never import this file from a "use client" component —
// the consumer key/secret must not reach the browser bundle.
export const wooCommerce = new WooCommerceRestApi({
  url,
  consumerKey,
  consumerSecret,
  version: "wc/v3",
});
