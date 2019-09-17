import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { URLS } from '@app/core/common/url-constant';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Utils } from '@app/shared/utils/utils';

@Injectable({
  providedIn: 'root'
})
export class SalesmanService {
  constructor(private http: HttpClient) {}

  getRetailerList(roleType: any) {
    return this.http.get(`${URLS.SALESMAN_RETAILER_LIST_API[roleType]}`);
  }

  search(term: string) {
    if (term === '') {
      return of([]);
    }
    return this.http.get(`${URLS.SALESMAN_RETAILER_SEARCH_API}` + term, { withCredentials: true }).pipe(
      map((response: []) => {
        const arr: string[] = [];
        // response['results'].map((a: any) => {
        //   console.log(a, 'a');
        //   arr.push(a['name']);
        // });
        const search_result = response['results'];
        return search_result;
      })
    );
  }

  retailerList(payload: any) {
    return this.http.get(`${URLS.SALESMAN_RETAILER_LIST_API}` + payload);
  }
}
