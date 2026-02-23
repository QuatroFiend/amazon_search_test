"use client";
import { FilterAccordion } from "@/app/UI/FilterAccordion/FilterAccordion";
import styles from "./filter_bar.module.css";
import CheckboxFilter from "@/app/UI/CheckBox/CheckBox";
import { IBrand } from "@/app/api/brands/IBrandTypes";
import { ICategory, IProductCategory } from "@/app/api/categories/ICategoriesTypes";

interface FilterBarProps {
    brands:IBrand[]|null
    categories:ICategory[]|null
    productCategories:IProductCategory[]|null
}

export const FilterBar = ({brands,categories,productCategories}:FilterBarProps) => {
  return (
    <div className={styles.filterBarWrapper}>
      <FilterAccordion
        title="Brands"
        isOpen={true}
        onToggle={() => {}}
      >
        <CheckboxFilter name="brand" onChange={() => {}} initialOption={[]} options={[]}/>
      </FilterAccordion>
    </div>
  );
};

export default FilterBar;
