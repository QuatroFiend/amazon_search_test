import {
  IBrand,
  ICategory,
  IProduct,
  IProductCategory,
} from "@/app/api/products/productTypes";
import ProductCardsContainer from "@/app/Components/ProductCard/ProductCardsContainer";
import Typography from "@/app/UI/Typography/Typography";
import styles from "./main_page.module.css";
import Pagination from "@/app/UI/Pagination/Pagination";

interface MainPageProps {
  products: IProduct[] | null;
  brands: IBrand[] | null;
  categories: ICategory[] | null;
  productCategories: IProductCategory[] | null;
}

const MainPage = ({
  products,
  brands,
  categories,
  productCategories,
}: MainPageProps) => {
  return (
    <div className={"page-container"}>
      <Typography content={"MainPage"} variant={"title"} />
      <div className={styles.productCardsContainer}>
        <ProductCardsContainer products={products} brands={brands} />
      </div>
      <Pagination
        pagination={{ page: 1, pageCount: 10, pageSize: 10, total: 100 }}
        paginationPage={1}
      />
    </div>
  );
};

export default MainPage;
