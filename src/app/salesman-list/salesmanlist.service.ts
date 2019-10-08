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
export class SalesmanlistService {
  constructor(private http: HttpClient) {}

  getSalesmanViaID(payload: any) {
    return this.http.get(`${URLS.SALESMAN_LIST}` + `?search=` + payload);
  }

  connectSalesman(payload: any) {
    return this.http.post(`${URLS.DISTRIBUTOR_SALESMAN_CONNECT}`, payload, { withCredentials: true });
  }

  getConnectedSalesman() {
    return this.http.get(`${URLS.DISTRIBUTOR_SALESMAN_LIST}`);
  }

  // distributorList(payload: any) {
  //   return this.http.get(`${URLS.DISTRIBUTOR_LIST__API}` + payload);
  // }
  //
  // orderListPlaced(payload: any, orderBySalesman?: any) {
  //   console.log('orderBySalesman', orderBySalesman);
  //   return this.http.post(`${URLS.ORDER_LIST_PLACED_API['retailer']}`, payload, { withCredentials: true });
  // }
}
