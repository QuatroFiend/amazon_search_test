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
      <Typography content={"MainPage"} variant={"title"} />
      <div className={styles.productCardsContainer}>
        <ProductCardsContainer products={products} brands={brands} />
      </div>
      <Pagination
        pagination={pagination}
        paginationPage={pagination.page}
      />
    </div>
  );
};

export default MainPage;
