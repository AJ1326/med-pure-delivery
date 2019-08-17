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
export class OrderListRetailerService {
  constructor(private http: HttpClient) {}

  distributorList(payload: any) {
    return this.http.get(`${URLS.DISTRIBUTOR_LIST__API}` + payload);
  }

  orderListData(startdate: string, enddate: string, page: any, limit: number, role: string, filter_type: any) {
    let qstring = '?page=' + page + '&limit=' + limit;
    if (startdate) {
      qstring += '&start_date=' + startdate;
    }
    if (enddate) {
      qstring += '&end_date=' + enddate;
    }
    if (filter_type === undefined || filter_type === null) {
      filter_type = 'all-order-list';
    }
    return this.http.get('orders/' + role + `${URLS.ORDER_LIST_GET_API[filter_type]}` + qstring, {
      withCredentials: true
    });
  }
}
