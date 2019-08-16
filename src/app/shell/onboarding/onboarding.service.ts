import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { URLS } from '@app/core/common/url-constant';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Utils } from '@app/shared/utils/utils';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  constructor(private http: HttpClient) {}

  sign_up(payload: any) {
    return this.http.post(`${URLS.REGISTRATION_API}`, payload);
  }

  check_url(id: string) {
    return this.http.get(`${URLS.ON_BOARD_API}` + `${id}` + `/`, { withCredentials: true });
  }
}
