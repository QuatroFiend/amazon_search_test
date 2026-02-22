import { supabase } from "../supabase/supabase";

export const getCategories = async () => {
  const { data } = await supabase.from("categories").select("*");
  return data;
};

export const getProductCategories = async () => {
  const { data } = await supabase.from("product_categories").select("*");
  return data;
};
