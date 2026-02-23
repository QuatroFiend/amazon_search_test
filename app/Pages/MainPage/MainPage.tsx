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
import SearchBar from "@/app/Components/SearchBar/SearchBar";
import Header from "@/app/UI/Header/Header";
import FilterBar from "@/app/Components/FilterBar/FilterBar";

interface MainPageProps {
  products: IProduct[] | null;
  brands: IBrand[] | null;
  categories: ICategory[] | null;
  productCategories: IProductCategory[] | null;
  pagination: IPagination;
}

const MainPage = ({
  products,
  brands,
  categories,
  productCategories,
  pagination,
}: MainPageProps) => {
  return (
    <div className={"page-container"}>
      <div className={styles.productCardsContainer}>
        <FilterBar
          categories={categories}
          brands={brands}
          productCategories={productCategories}
        />
        <ProductCardsContainer products={products} brands={brands} />
      </div>
      <Pagination pagination={pagination} paginationPage={pagination.page} />
    </div>
  );
};

export default MainPage;
