import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { URLS } from '@app/core/common/url-constant';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Utils } from '@app/shared/utils/utils';
import { Credentials, UserInfo } from '@app/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(payload: any) {
    return this.http.post<Credentials>(`${URLS.LOGIN_API}`, payload, { withCredentials: true });
  }

  signup(payload: any) {
    return this.http.post(`${URLS.ON_BOARD_API}`, payload);
  }

  verify_signup_otp(payload: any) {
    return this.http.post(`${URLS.SIGNUP_OTP_VERIFY}`, payload);
  }

  resend_boarding_email(payload: any) {
    return this.http.get(`${URLS.RESEND_BOARDING_EMAIL}` + payload, { withCredentials: true });
  }

  resend_signup_otp(payload: any) {
    return this.http.post(`${URLS.SIGNUP_OTP_RESEND}`, payload);
  }

  forgot(payload: any) {
    return this.http.post(`${URLS.FORGOT_PASSWORD_API}`, payload);
  }

  change_password(payload: any) {
    return this.http.post(`${URLS.CHANGE_PASSWORD_API}`, payload);
  }

  userinfo() {
    return this.http.get<UserInfo>(`${URLS.USER_INFO_API}`, { withCredentials: true });
  }
}
