import ProductCardsContainer from "@/app/Components/ProductCard/ProductCardsContainer";
import Typography from "@/app/UI/Typography/Typography";
import styles from "./main_page.module.css";
import Pagination, { IPagination } from "@/app/UI/Pagination/Pagination";
import { IProduct } from "@/app/api/products/types";
import { FacetCounts } from "@/app/api/products/types";
import { IBrand } from "@/app/api/brands/IBrandTypes";
import { ICategory } from "@/app/api/categories/ICategoriesTypes";
import FilterBar from "@/app/Components/FilterBar/FilterBar";

interface MainPageProps {
  products: IProduct[] | null;
  brands: IBrand[] | null;
  categories: ICategory[] | null;
  facetCounts: FacetCounts;
  pagination: IPagination;
}

const MainPage = ({
  products,
  brands,
  categories,
  facetCounts,
  pagination,
}: MainPageProps) => {
  return (
    <div className={"page-container"}>
      <div className={styles.productCardsContainer}>
        <FilterBar
          categories={categories}
          brands={brands}
          facetCounts={facetCounts}
        />
        {products?.length === 0 ? (
          <Typography variant={"info"}>Ничего не найдено</Typography>
        ) : (
          <ProductCardsContainer products={products} brands={brands} />
        )}
      </div>
      <Pagination pagination={pagination} paginationPage={pagination.page} />
    </div>
  );
};

export default MainPage;
