import { supabase } from "../supabase/supabase";

export const getBrands = async () => {
  const { data } = await supabase.from("brands").select("*");
  return data;
};