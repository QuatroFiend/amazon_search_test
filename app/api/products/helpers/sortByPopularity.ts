import { IProduct } from "../types";

export const sortByPopularity = (products: IProduct[]): IProduct[] => {
  const brandMap = products.reduce(
    (accumulator, item) => {
      if (item.brand_id) {
        accumulator[item.brand_id] = (accumulator[item.brand_id] || 0) + 1;
      }

      return accumulator;
    },
    {} as Record<number, number>,
  );

  return [...products].sort((left, right) => {
    const countA = brandMap[left.brand_id] || 0;
    const countB = brandMap[right.brand_id] || 0;

    if (countA !== countB) {
      return countB - countA;
    }

    return (
      new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
    );
  });
};
