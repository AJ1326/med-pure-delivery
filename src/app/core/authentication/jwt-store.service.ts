import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { CookieService } from 'ngx-cookie-service';

export interface JWTToken {
  token: string;
}

export interface JWTResponse {
  token: string;
  // user: User;
}

const jwtTokenKey = 'credentials';
const expirationTimeKey = 'keyExpirationTime';
const tokenValidityPeriod = 180000; // refresh token after 3 min

/**
 * Provides means to save and read JWT tokens from storage (cookie, session or local storage).
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable({ providedIn: 'root' })
export class JWTStoreService {
  private _jwtToken: JWTToken | null;

  constructor(private cookieService: CookieService) {}

  /**
   * Gets the current JWT token.
   * @return {JWTToken} The user JWT token or null if the user is not authenticated.
   */
  get jwtToken(): JWTToken | null {
    return this._jwtToken;
  }

  /**
   * Loads JWT token from a store.
   * The method tries to read the token from the storage in the following order: cookie, session storage or local storage.
   */
  loadJWTToken(): JWTToken {
    let savedTokenCookie: string | null = null;
    if (this.cookieService.check(jwtTokenKey)) {
      savedTokenCookie = this.cookieService.get(jwtTokenKey);
    } else {
      savedTokenCookie = sessionStorage.getItem(jwtTokenKey) || localStorage.getItem(jwtTokenKey);
    }
    this._jwtToken = savedTokenCookie === null ? null : JSON.parse(savedTokenCookie);
    return this._jwtToken;
  }

  /**
   * Sets the JWT token.
   * The JWT token may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the token is only persisted for the current session.
   * @param {JWTToken=} token The user JWT token or `null` in case you want to remove the token.
   * @param {boolean=} remember True to remember JWT token across sessions.
   */
  saveJWTToken(token?: JWTToken, remember?: boolean): JWTToken {
    this._jwtToken = token || null;
    const expirationTime = new Date().getTime() + tokenValidityPeriod; // 3 minutes added to present time to get expiration time.

    if (token) {
      this.cookieService.set(jwtTokenKey, JSON.stringify(token), expirationTime, '/', environment.cookieDomain);
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(jwtTokenKey, JSON.stringify(token));
      storage.setItem(expirationTimeKey, expirationTime.toString());
      return token;
    } else {
      this.clearJWTToken();
      return null;
    }
  }

  /**
   * Clears JWT token from all storages (cookie, session, local storage).
   */
  clearJWTToken() {
    this.cookieService.delete(jwtTokenKey, '/', environment.cookieDomain);
    sessionStorage.removeItem(expirationTimeKey);
    localStorage.removeItem(expirationTimeKey);
    sessionStorage.removeItem(jwtTokenKey);
    localStorage.removeItem(jwtTokenKey);
  }

  isTokenRefreshNeeded(): boolean {
    const tokenSoonExpiresInterval = 15000; // 15 sec
    if (this._jwtToken) {
      const expiryDatetime = +(sessionStorage.getItem(expirationTimeKey) || localStorage.getItem(expirationTimeKey));
      const currentDateTime = new Date().getTime();
      //   console.log(expiryDatetime, currentDateTime);
      return expiryDatetime - currentDateTime <= tokenSoonExpiresInterval;
    }
    return false;
  }
}
