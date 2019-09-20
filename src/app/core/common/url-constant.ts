import { environment } from '@env/environment';

export const URL: string = environment.APIserverUrl;

/* Common url file for defining all the url's */

export const URLS = {
  // Authentication
  LOGIN_API: `rest-auth/login/`,
  USER_INFO_API: `user/`,
  ON_BOARD_API: `user_onboard/`,
  SIGNUP_OTP_RESEND: `user_onboard/resend_otp/`,

  SIGNUP_OTP_VERIFY: `user_onboard/validate_otp/`,
  RESEND_BOARDING_EMAIL: `user_onboard/resend_email/`,
  FORGOT_PASSWORD_API: `rest-auth/password/reset/`,
  REFRESH_TOKEN: `token-refresh/`,
  CHANGE_PASSWORD_API: `rest-auth/password/change/`,
  REGISTRATION_API: `rest-auth/registration/`,
  //Home page card filter data
  FILTER_CARD_LIST__API: {
    retailer: `retailer/dashboard`,
    distributor: `distributor/dashboard`
  },
  // List of distributors
  DISTRIBUTOR_LIST__API: `distributor/?product_slug=`,

  // const filterCardArray = ['all-order-list', 'pending-order-list', 'open-order-list', 'closed-order-list'];
  ORDER_LIST_PLACED_API: {
    retailer: `orders/retailer/`,
    distributor: `orders/distributor/`
  },
  ORDER_LIST_GET_API: {
    'all-order-list': '/',
    'by-source': '/by_source/',
    'pending-order-list': '/pending_orders/',
    'fast-moving-order-list': '/'
  },
  // DISTRIBUTOR_ORDER_LIST_PLACED_API: `orders/distributor/`,
  UPLOAD_LIST_API: `uploads/distributor_product_list/`,
  //Salesman view
  SALESMAN_RETAILER_LIST_API: `salesman/?retailer_name=`,
  SALESMAN_RETAILER_SEARCH_API: `retailer_list/?search=`,

  SALESMAN_DISTRIBUTOR_LIST_API: `salesman/distributor_list`,
  // ORDER_LIST_PLACED_API: `orders/retailer/`,
  SALESMAN_ADD_RETAILER: `salesman/add-retailers/`,
  SALESMAN_VERIFY_OTP_RETAILER: `salesman/add-retailers/validate_otp/`
};
