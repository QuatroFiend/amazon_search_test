import MainPage from "./Pages/MainPage/MainPage";
import { getProducts } from "./api/products/productService";
import { getCategories } from "./api/categories/categoriesService";
import { getBrands } from "./api/brands/brandsService";
import { ProductFilters, SortOption } from "./api/products/types";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    brands?: string;
    categories?: string;
    sortBy?: string;
    q?: string;
    debugError?: string;
  }>;
}) {
  const params = await searchParams;

  if (process.env.NODE_ENV !== "production" && params.debugError === "1") {
    throw new Error("Debug error boundary test");
  }

  const parsedPage = Number(params.page);
  const page =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;

  const [brands, categories] = await Promise.all([getBrands(), getCategories()]);

  const brandParams = params.brands?.toString().split(",") || [];
  const categoriesParams = params.categories?.toString().split(",") || [];
  const q = params.q?.toString().trim() || "";
  const sortBy = (params.sortBy as SortOption) || "newest";

  const brandIds = brandParams
    .map(
      (name) =>
        brands?.find((b) => b.name.toLowerCase() === name.toLowerCase())?.id,
    )
    .filter((id): id is number => id !== undefined);

  const categoryIds = categoriesParams
    .map(
      (name) =>
        categories?.find((c) => c.name.toLowerCase() === name.toLowerCase())
          ?.id,
    )
    .filter((id): id is number => id !== undefined);

  const filters: ProductFilters = {
    brandIds: brandIds.length > 0 ? brandIds : undefined,
    categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
    sortBy,
    q: q || undefined,
  };

  const productData = await getProducts({ page, pageSize: 12 }, filters);

  if (productData.page !== page) {
    const nextParams = new URLSearchParams();

    if (params.brands) nextParams.set("brands", params.brands);
    if (params.categories) nextParams.set("categories", params.categories);
    if (params.sortBy) nextParams.set("sortBy", params.sortBy);
    if (q) nextParams.set("q", q);
    if (productData.page > 1) nextParams.set("page", String(productData.page));

    const query = nextParams.toString();
    redirect(query ? `/?${query}` : "/");
  }
  return (
    <div>
      <MainPage
        products={productData.data}
        brands={brands}
        categories={categories}
        facetCounts={productData.facetCounts}
        pagination={{
          page: productData.page,
          pageCount: productData.pageCount,
          pageSize: productData.pageSize,
          total: productData.total,
        }}
      />
    </div>
  );
}
