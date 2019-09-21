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
export class PlacingOrderService {
  constructor(private http: HttpClient) {}

  distributorList(payload: any) {
    return this.http.get(`${URLS.DISTRIBUTOR_LIST__API}` + payload);
  }

  orderListPlaced(payload: any, orderBySalesman?: any) {
    console.log('orderBySalesman value', orderBySalesman);
    let payload_data;
    // if (orderBySalesman) {
    payload_data = {
      order: payload,
      retailer_slug: orderBySalesman['retailer_slug']
    };
    // } else {
    //   payload_data = payload;
    // }
    // console.log('payload_data', payload_data);
    return this.http.post(`${URLS.ORDER_LIST_PLACED_API['retailer']}`, payload_data, { withCredentials: true });
  }
}
