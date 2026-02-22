import { IBrand } from "@/app/api/products/IProductTypes";

export function createBrandMap(brands: IBrand[] | null): Map<number, string> {
  const map = new Map<number, string>();
  brands?.forEach((brand) => map.set(brand.id, brand.name));
  return map;
}