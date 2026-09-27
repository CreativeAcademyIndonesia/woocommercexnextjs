import ProductListSec from "@/components/common/ProductListSec";
import BreadcrumbProduct from "@/components/product-page/BreadcrumbProduct";
import Header from "@/components/product-page/Header";
import Tabs from "@/components/product-page/Tabs";
import {
  getProductById,
  getRelatedProducts,
} from "@/lib/woocommerce/products";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const productId = Number(params.slug[0]);

  if (!productId || Number.isNaN(productId)) {
    notFound();
  }

  const productData = await getProductById(productId);

  if (!productData) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(productData);

  return (
    <main>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbProduct title={productData.title} />
        <section className="mb-11">
          <Header data={productData} />
        </section>
        <Tabs />
      </div>
      {relatedProducts.length > 0 && (
        <div className="mb-[50px] sm:mb-20">
          <ProductListSec title="You might also like" data={relatedProducts} />
        </div>
      )}
    </main>
  );
}
