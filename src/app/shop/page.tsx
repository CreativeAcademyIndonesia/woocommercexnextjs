import BreadcrumbShop from "@/components/shop-page/BreadcrumbShop";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MobileFilters from "@/components/shop-page/filters/MobileFilters";
import Filters from "@/components/shop-page/filters";
import { FiSliders } from "react-icons/fi";
import ProductCard from "@/components/common/ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  getCategoryIdBySlug,
  getProducts,
  GetProductsParams,
} from "@/lib/woocommerce/products";

const PER_PAGE = 9;

type SearchParams = {
  page?: string;
  category?: string;
  sort?: "most-popular" | "low-price" | "high-price";
};

function sortToOrderby(
  sort: SearchParams["sort"]
): Pick<GetProductsParams, "orderby" | "order"> {
  switch (sort) {
    case "low-price":
      return { orderby: "price", order: "asc" };
    case "high-price":
      return { orderby: "price", order: "desc" };
    case "most-popular":
    default:
      return { orderby: "popularity", order: "desc" };
  }
}

function buildPageHref(searchParams: SearchParams, page: number) {
  const params = new URLSearchParams();
  if (searchParams.category) params.set("category", searchParams.category);
  if (searchParams.sort) params.set("sort", searchParams.sort);
  params.set("page", String(page));
  return `/shop?${params.toString()}`;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const currentPage = Math.max(1, Number(searchParams.page) || 1);

  const categoryId = searchParams.category
    ? await getCategoryIdBySlug(searchParams.category)
    : null;

  const { products, total, totalPages } = await getProducts({
    page: currentPage,
    perPage: PER_PAGE,
    category: categoryId ?? undefined,
    ...sortToOrderby(searchParams.sort),
  });

  const rangeStart = total === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1;
  const rangeEnd = Math.min(currentPage * PER_PAGE, total);

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbShop />
        <div className="flex md:space-x-5 items-start">
          <div className="hidden md:block min-w-[295px] max-w-[295px] border border-black/10 rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black text-xl">Filters</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
            <Filters />
          </div>
          <div className="flex flex-col w-full space-y-5">
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl md:text-[32px] capitalize">
                  {searchParams.category ?? "All Products"}
                </h1>
                <MobileFilters />
              </div>
              <div className="flex flex-col sm:items-center sm:flex-row">
                <span className="text-sm md:text-base text-black/60 mr-3">
                  {total === 0
                    ? "No products found"
                    : `Showing ${rangeStart}-${rangeEnd} of ${total} Products`}
                </span>
                <div className="flex items-center">
                  Sort by:{" "}
                  <Select defaultValue={searchParams.sort ?? "most-popular"}>
                    <SelectTrigger className="font-medium text-sm px-1.5 sm:text-base w-fit text-black bg-transparent shadow-none border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="most-popular">Most Popular</SelectItem>
                      <SelectItem value="low-price">Low Price</SelectItem>
                      <SelectItem value="high-price">High Price</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} data={product} />
              ))}
            </div>
            <hr className="border-t-black/10" />
            <Pagination className="justify-between">
              <PaginationPrevious
                href={buildPageHref(searchParams, Math.max(1, currentPage - 1))}
                className="border border-black/10"
              />
              <PaginationContent>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(0, 10)
                  .map((pageNumber) => (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href={buildPageHref(searchParams, pageNumber)}
                        className="text-black/50 font-medium text-sm"
                        isActive={pageNumber === currentPage}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                {totalPages > 10 && (
                  <PaginationItem>
                    <PaginationEllipsis className="text-black/50 font-medium text-sm" />
                  </PaginationItem>
                )}
              </PaginationContent>

              <PaginationNext
                href={buildPageHref(
                  searchParams,
                  Math.min(totalPages, currentPage + 1)
                )}
                className="border border-black/10"
              />
            </Pagination>
          </div>
        </div>
      </div>
    </main>
  );
}
