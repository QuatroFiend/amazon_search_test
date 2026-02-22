import { IBrand, ICategory, IProduct, IProductCategory } from "@/app/api/products/productTypes";
import ProductCardsContainer from "@/app/Components/ProductCard/ProductCardsContainer";
import Typography from "@/app/UI/Typography/Typography";
import styles from "./main_page.module.css";


interface MainPageProps{
    products: IProduct[]|null
    brands:IBrand[]|null
    categories:ICategory[]|null
    productCategories:IProductCategory[]|null
}


const MainPage = ({products,brands,categories,productCategories}: MainPageProps) => {
  return (
    <div className={'page-container'}>
      <Typography content={"MainPage"} variant={"title"} />
      <div className={styles.productCardsContainer}>
        <ProductCardsContainer products={products} brands={brands}/>
      </div>
    </div>
  );
};

export default MainPage;
