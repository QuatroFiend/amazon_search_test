import { ProductFilters, FacetCounts } from "../types";
import { buildBrandFacetCounts } from "./brandFacetService";
import { buildCategoryFacetCounts } from "./categoryFacetService";

export const buildFacetCounts = async (
  filters?: ProductFilters,
): Promise<FacetCounts> => {
  const [brands, categories] = await Promise.all([
    buildBrandFacetCounts(filters),
    buildCategoryFacetCounts(filters),
  ]);

  return {
    brands,
    categories,
  };
};
