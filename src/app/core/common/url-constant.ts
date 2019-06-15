import { environment } from '@env/environment';

export const URL: string = environment.APIserverUrl;

/* Common url file for defining all the url's */

export const URLS = {
  //Authentication
  LOGIN_API: `rest-auth/login/`,
  SIGN_UP_API: `rest-auth/sign-up/`,
  FORGOT_PASSWORD_API: `rest-auth/sign-up/`,
  REFRESH_TOKEN: `token-refresh/`,

  //List of distributors
  DISTRIBUTOR_LIST__API: `distributor/?product_slug=`,
  ORDER_LIST_PLACED_API: `orders/retailer/`
};
