import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { URLS } from '@app/core/common/url-constant';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Utils } from '@app/shared/utils/utils';

let search_result: any[] = [];
let searchFailed = false;

@Injectable({
  providedIn: 'root'
})
export class PlacingOrderService {
  constructor(private http: HttpClient) {}

  distributorList(payload: any) {
    return this.http.get(`${URLS.DISTRIBUTOR_LIST__API}` + payload);
  }

  search(term: string) {
    if (term === '') {
      return of([]);
    }
    return this.http.get(`${URLS.PRODUCT_SEARCH_API}` + term, { withCredentials: true }).pipe(
      map((response: []) => {
        const arr: string[] = [];
        search_result = response['results'];
        console.log('search_result', search_result);
        return search_result;
      })
    );
  }

  setMySearchResult(val: boolean) {
    searchFailed = val;
  }

  getMySearchResult(val: boolean) {
    return searchFailed;
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
