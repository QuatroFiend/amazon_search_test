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
  if (params.debugError) throw new Error(params.debugError);
  const parsedPage = Number(params.page);
  const page =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;

  const [brands, categories] = await Promise.all([
    getBrands(),
    getCategories(),
  ]);

  const parseIdsFromParam = (rawValue?: string): number[] => {
    if (!rawValue) return [];

    const parsedIds = rawValue
      .split(",")
      .map((value) => Number.parseInt(value.trim(), 10))
      .filter((id) => Number.isInteger(id) && id > 0);

    return Array.from(new Set(parsedIds));
  };

  const brandIds = parseIdsFromParam(params.brands?.toString());
  const categoryIds = parseIdsFromParam(params.categories?.toString());
  const q = params.q?.toString().trim() || "";
  const sortBy = (params.sortBy as SortOption) || "newest";

  const filters: ProductFilters = {
    brandIds: brandIds.length > 0 ? brandIds : undefined,
    categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
    sortBy,
    q: q || undefined,
  };

  const productData = await getProducts({ page, pageSize: 12 }, filters);

  if (productData.page !== page) {
    const nextParams = new URLSearchParams();

    if (brandIds.length > 0) nextParams.set("brands", brandIds.join(","));
    if (categoryIds.length > 0) {
      nextParams.set("categories", categoryIds.join(","));
    }
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
