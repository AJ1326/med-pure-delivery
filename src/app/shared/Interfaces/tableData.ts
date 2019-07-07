export interface OrderList {
  count?: number;
  next?: any;
  previous?: string;
  results: Array<List>;
}

export interface List {
  order_id?: string;
  uuid?: string;
  order_date: string;
  total_amount: number;
  order_details: Array<OrderDetail>;
}

export interface ProductInfo {
  price: number;
  name: string;
  slug: string;
}

export interface OrderDetail {
  quantity: number;
  product: ProductInfo;
  distributor: DistributorInfo;
}

export interface DistributorInfo {
  name: string;
  slug: string;
}
