import { supabase } from "../supabase/supabase";



export const getProducts = async () => {
    const { data } = await supabase.from("products").select("*");
    return data;
};


export const getCategories=async ()=>{
    const {data}=await supabase.from("categories").select("*");
    return data;
}

export const getBrands=async ()=>{
    const {data}=await supabase.from("brands").select("*");
    return data;
}

export const getProductCategories=async ()=>{
    const {data}=await supabase.from("product_categories").select("*");
    return data;
}