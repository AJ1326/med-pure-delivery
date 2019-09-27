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
export class HomeService {
  constructor(private http: HttpClient) {}

  cardListData(roleType: any, orderFromSalesman?: any) {
    if (orderFromSalesman) {
      return this.http.get(`${URLS.FILTER_CARD_LIST__API[roleType]}`);
    } else {
      return this.http.get(`${URLS.FILTER_CARD_LIST__API[roleType]}` + '?=' + orderFromSalesman);
    }
  }
}
