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

  orderListData(payload: any) {
    return this.http.get(`${URLS.ORDER_LIST_PLACED_API}`, { withCredentials: true });
  }
}
