import ProductCardsContainer from "@/app/Components/ProductCard/ProductCardsContainer";
import styles from "./main_page.module.css";
import Pagination, { IPagination } from "@/app/UI/Pagination/Pagination";
import { IProduct, FacetCounts } from "@/app/api/products/types";
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
  const hasProducts = (products?.length || 0) > 0;

  return (
    <div className={"page-container"}>
      <div className={styles.productCardsContainer}>
        <FilterBar categories={categories} brands={brands} facetCounts={facetCounts} />
        <div className={styles.resultsArea}>
          {hasProducts ? (
            <ProductCardsContainer products={products} brands={brands} />
          ) : (
            <section className={styles.emptyState}>
              <h2 className={styles.emptyStateTitle}>No products found</h2>
              <p className={styles.emptyStateText}>
                Try changing filters or search query.
              </p>
            </section>
          )}
        </div>
      </div>
      <Pagination pagination={pagination} paginationPage={pagination.page} />
    </div>
  );
};

export default MainPage;
