import {  IProduct } from "@/app/api/products/IProductTypes";
import { createBrandMap } from "@/app/utils/getBrandName";
import ProductCard from "./ProductCard";
import styles from "./product_card_container.module.css";
import { IBrand } from "@/app/api/brands/IBrandTypes";

interface ProductCardsContainerProps {
    products: IProduct[]|null
    brands:IBrand[]|null
}

const ProductCardsContainer = ({products,brands}:ProductCardsContainerProps) => {
    const brandMap = createBrandMap(brands);
    return (
        <div className={styles.productCardsContainer}>
            {products?.map((product)=>(
                <ProductCard key={product.id}
                    productName={product.name}
                    productImage={product.image}
                    brand={brandMap.get(product.brand_id) || ''}
                />
            ))}
        </div>
    )
}

export default ProductCardsContainer;