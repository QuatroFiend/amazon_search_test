import { use } from "react";
import MainPage from "./Pages/MainPage/MainPage";
import {
  getBrands,
  getCategories,
  getProductCategories,
  getProducts,
} from "./api/products/productService";
import {
  IBrand,
  ICategory,
  IProduct,
  IProductCategory,
} from "./api/products/productTypes";

export default function Home() {
  const productData: IProduct[] | null = use(getProducts());
  const categories: ICategory[] | null = use(getCategories());
  const productCategories: IProductCategory[] | null = use(
    getProductCategories(),
  );
  const brands: IBrand[] | null = use(getBrands());
 

  return (
    <div>
      <MainPage products={productData} brands={brands} categories={categories} productCategories={productCategories}/>
    </div>
  );
}
