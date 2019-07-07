import { environment } from '@env/environment';

export const URL: string = environment.APIserverUrl;

/* Common url file for defining all the url's */

export const URLS = {
  //Authentication
  LOGIN_API: `rest-auth/login/`,
  USER_INFO_API: `user/`,
  ON_BOARD_API: `user_onboard/`,
  FORGOT_PASSWORD_API: `rest-auth/sign-up/`,
  REFRESH_TOKEN: `token-refresh/`,

  //List of distributors
  DISTRIBUTOR_LIST__API: `distributor/?product_slug=`,
  ORDER_LIST_PLACED_API: `orders/retailer/`,
  DISTRIBUTOR_ORDER_LIST_PLACED_API: `orders/distributor/`,
  UPLOAD_LIST_API: `uploads/distributor_product_list/`
};
