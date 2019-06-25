import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { URLS } from '@app/core/common/url-constant';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Utils } from '@app/shared/utils/utils';
import { Credentials } from '@app/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(payload: any) {
    return this.http.post<Credentials>(`${URLS.LOGIN_API}`, payload, { withCredentials: true });
  }

  signup(payload: any) {
    return this.http.post(`${URLS.SIGN_UP_API}`, payload);
  }

  forgot(payload: any) {
    return this.http.post(`${URLS.FORGOT_PASSWORD_API}`, payload);
  }
}
