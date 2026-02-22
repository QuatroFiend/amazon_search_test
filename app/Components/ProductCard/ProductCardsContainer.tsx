import { IBrand, IProduct } from "@/app/api/products/productTypes";
import { createBrandMap } from "@/app/utils/getBrandName";
import ProductCard from "./ProductCard";
import styles from "./product_card_container.module.css";


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