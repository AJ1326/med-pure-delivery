export interface OrderList {
  id: number;
  name: string;
  order_number: string;
  product: Array<ProductList>;
}

export interface ProductList {
  id?: number;
  qauntity?: string;
  price?: string;
  product_name?: string;
}
