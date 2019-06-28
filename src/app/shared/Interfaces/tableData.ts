export interface OrderList {
  order_id?: string;
  order_date: string;
  total_amount: number;
  order_details: Array<ProductList>;
}

export interface ProductList {
  quantity: number;
  product: ProductInfo;
  distributor: DistributorInfo;
}

export interface ProductInfo {
  available_quantity: number;
  price: number;
  name: string;
  slug: string;
}

export interface DistributorInfo {
  name: string;
  slug: string;
}
