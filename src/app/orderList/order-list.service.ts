import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { URLS } from '@app/core/common/url-constant';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Utils } from '@app/shared/utils/utils';

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
    return this.http.get(`${URLS.ORDER_LIST_PLACED_API['distributor']}` + 'compiled_order_csv');
  }
}
