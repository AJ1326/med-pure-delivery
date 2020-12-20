import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URLS } from '@app/core/common/url-constant';

@Injectable({
  providedIn: 'root'
})
export class OrderListService {
  constructor(private http: HttpClient) {}

  rejectOrderByDistributor(payload: any) {
    console.log('payload', payload);
    return this.http.put(
      `${URLS.ORDER_LIST_PLACED_API['distributor']}` + payload.order_id + '/',
      { status: 'rejected_by_distributor' },
      { withCredentials: true }
    );
  }

  downloadCsvDistributor(payload: string) {
    return this.http.get(`${URLS.ORDER_LIST_PLACED_API['distributor']}` + payload + '/compiled_order_csv');
  }

  downloadPendingProductList() {
    return this.http.get(`${URLS.ORDER_LIST_PLACED_API['distributor']}` + 'pending_order_csv');
  }

  downloadBatchRetailerProductList(slug: any, uuid: any) {
    return this.http.get(
      `${URLS.ORDER_LIST_PLACED_API['distributor']}` + uuid + '/retailer_batch_csv/?retailer_slug=' + slug
    );
  }

  downloadBatchRetailerList(uuid: any) {
    return this.http.get(`${URLS.ORDER_LIST_PLACED_API['distributor']}` + uuid + '/retailer_batch_csv/');
  }

  acceptPendingOrderList() {
    return this.http.get(`${URLS.ORDER_LIST_PLACED_API['distributor']}` + 'pending_orders/accept');
  }
}
