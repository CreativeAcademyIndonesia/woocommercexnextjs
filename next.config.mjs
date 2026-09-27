/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "woocommerce-1674799-6695728.cloudwaysapps.com",
      },
    ],
  },
};

export default nextConfig;
