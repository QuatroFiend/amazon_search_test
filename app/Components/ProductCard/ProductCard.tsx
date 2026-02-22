import { Button } from "@/app/UI/Button/Button";
import Typography from "@/app/UI/Typography/Typography";
import Image from "next/image";
import styles from "./product_card.module.css";

interface ProductCardProps {
  productName: string;
  productImage: string;
  brand: string;
}

const ProductCard = ({
  productName,
  productImage,
  brand,
}: ProductCardProps) => {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.imageWrapper}>
        <Image src={productImage} alt="ProductCard" width={200} height={200} />
      </div>
      <div className={styles.cardContent}>
        <Typography variant={"cardTitle"}>{productName}</Typography>
        <Typography variant={"info"}>{brand}</Typography>
        <Button buttonName={"Add to cart"} />
      </div>
    </div>
  );
};

export default ProductCard;
