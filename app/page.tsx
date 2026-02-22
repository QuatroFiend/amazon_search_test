import MainPage from "./Pages/MainPage/MainPage";
import { getProducts } from "./api/products/productService";
import {
  getCategories,
  getProductCategories,
} from "./api/categories/categoriesService";
import { getBrands } from "./api/brands/brandsService";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [productData, categories, productCategories, brands] =
    await Promise.all([
      getProducts({ page, pageSize: 12 }),
      getCategories(),
      getProductCategories(),
      getBrands(),
    ]);

  return (
    <div>
      <MainPage
        products={productData.data}
        brands={brands}
        categories={categories}
        productCategories={productCategories}
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