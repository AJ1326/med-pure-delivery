import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoginService } from '@app/login/login.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpResponse } from '@angular/common/http';
// import {CookieService} from "ngx-cookie-service";

export interface Credentials {
  // Customize received credentials here
  email: string;
  key: string;
  role: Array<string>;
  permissions: Array<string>;
}

export interface UserInfo {
  // Customize received credentials here
  name: string;
  email: string;
  shop_name: string;
}

export interface LoginContext {
  email: string;
  password: string;
}

const credentialsKey = 'credentials';

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {
  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }
  logged_in_role: any;
  private _credentials: Credentials | null;

  constructor(private LoginService: LoginService, private cookieService: CookieService) {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {
    // Replace by proper authentication call
    // return this.http.post<Credentials>(`${URLS.LOGIN_API}`, context, {withCredentials: true});
    // this.logged_in_role = {
    //   key: 'f220702e6f2ae9c515ffcd7c2870cceca0ee0347',
    //     role: ['retailer_role'],
    //     agreement: [
    //     {
    //       agreement_type: 'no'
    //     }
    //   ],
    //     permissions: ['can_cancel_orders', 'can_place_orders', 'can_view_products', 'can_view_self_orders_as_retailer']
    // };
    // Login service call

    return this.LoginService.login(context);
    //
    // .subscribe(
    //   (credentials: any) => {
    //     this.logged_in_role = credentials;
    //   },
    //   (error: any) => {
    //     console.log('error', error);
    //     this.logged_in_role = error;
    //   }
    // );

    // this.setCredentials(this.logged_in_role);
    // return of(this.logged_in_role);
  }

  userInfo(): Observable<UserInfo> {
    return this.LoginService.userinfo();
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.cookieService.deleteAll();
    this.setCredentials();
    return of(true);
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    console.log('isAuth:', !!this.credentials);
    return !!this.credentials;
  }

  permissionView(): string | boolean {
    let role = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (role) {
      role = JSON.parse(role);
      const role_type = role['role'][0];
      return role_type;
    } else {
      return false;
    }
  }

  onboardingView(): string | boolean {
    let boarding = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (boarding) {
      boarding = JSON.parse(boarding);
      // console.log('lolololo', boarding['agreement_signed']
      const boardValue = boarding['agreement_signed'];
      return boardValue;
    } else {
      return false;
    }
  }

  getToken(): string | boolean {
    let token = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (token) {
      token = JSON.parse(token);
      const key = token['key'];
      return key;
    } else {
      return false;
    }
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  public setCredentials(credentials?: Credentials, remember?: true) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
      localStorage.setItem(credentialsKey, JSON.stringify(credentials));
      // this.cookieService.set('sessionid', JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }
}
