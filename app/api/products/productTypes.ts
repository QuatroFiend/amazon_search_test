


export type IProduct = {
    id: number;
    name: string;
    created_at: string;
    image: string;
    brand_id:number;
}

export type IBrand = {
    id: number;
    name: string;
    image: string;
}


export type ICategory = {
    id: number;
    name: string;
    created_at: string;
}

export type IProductCategory={
    categoryId:string;
    productId:string;
    created_at:string;
}