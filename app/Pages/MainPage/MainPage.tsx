import ProductCardsContainer from "@/app/Components/ProductCard/ProductCardsContainer";
import Typography from "@/app/UI/Typography/Typography";
import styles from "./main_page.module.css";
import Pagination, { IPagination } from "@/app/UI/Pagination/Pagination";
import { IProduct } from "@/app/api/products/IProductTypes";
import { IBrand } from "@/app/api/brands/IBrandTypes";
import {
  ICategory,
  IProductCategory,
} from "@/app/api/categories/ICategoriesTypes";
import FilterBar from "@/app/Components/FilterBar/FilterBar";

interface MainPageProps {
  products: IProduct[] | null;
  brands: IBrand[] | null;
  categories: ICategory[] | null;
  pagination: IPagination;
}

const MainPage = ({
  products,
  brands,
  categories,
  pagination,
}: MainPageProps) => {
  return (
    <div className={"page-container"}>
      <div className={styles.productCardsContainer}>
        <FilterBar
          categories={categories}
          brands={brands}
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
