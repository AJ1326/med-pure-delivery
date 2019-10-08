import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URLS } from '@app/core/common/url-constant';
import { Observable } from 'rxjs';
import { SignUpContext } from '@app/core';

@Injectable({
  providedIn: 'root'
})
export class AddSalesmanService {
  constructor(private http: HttpClient) {}

  rejectOrderByDistributor(payload: any) {
    console.log('payload', payload);
    return this.http.put(
      `${URLS.ORDER_LIST_PLACED_API['distributor']}` + payload.order_id + '/',
      { status: 'rejected_by_distributor' },
      { withCredentials: true }
    );
  }
}
