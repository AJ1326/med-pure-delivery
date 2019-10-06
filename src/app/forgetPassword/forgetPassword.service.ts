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
export class ForgetPasswordService {
  constructor(private http: HttpClient) {}

  forgot_password(payload: any, verificationNumber: string, verificationCode: string) {
    const payload_body = {
      token: verificationCode,
      uid: verificationNumber,
      new_password1: payload['new_password1'],
      new_password2: payload['new_password2']
    };
    return this.http.post(`${URLS.FORGET_PASSWORD_API}`, payload_body);
  }
}
