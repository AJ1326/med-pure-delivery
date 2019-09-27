import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProviderDataValidators as Validators } from '@app/modules/data-valiidator';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { LoginService } from '@app/login/login.service';

const log = new Logger('Login');
const credentialsKey = 'credentials';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  version: string = environment.version;
  signuperrorregistered: string;
  signuperrorexists: string;
  signuperrorphonenumber: string;
  error: string;
  loginForm: FormGroup;
  forgetPasswordForm: FormGroup;
  signUpForm: FormGroup;
  isLoading = false;
  setForgetPass = false;
  onBoardingSuccess = false;
  loginMobileOpen = false;
  form_type: string;
  forgrt_email_sent = false;
  from = '';
  typeForm = 'login';
  show_otp_form = false;
  otp_code: number;
  signUpData: any;
  otp_error: any;
  LoginErrorMessage: string;
  ForgetPasswordErrorMessage: string;
  showMobileIconClosed = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService,
    private LoginService: LoginService
  ) {
    this.createForm();
    this.route.queryParams.subscribe(params => {
      this.from = params['from'];
      console.log('params: ', params);
      console.log(this.from);
    });
  }

  ngOnInit() {
    const role = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (role) {
      const roleType = this.authenticationService.permissionView();
      if (roleType === 'retailer') {
        this.route.queryParams.subscribe(params => this.router.navigate(['/retailer'], { replaceUrl: true }));
      } else if (roleType === 'retailer') {
        this.route.queryParams.subscribe(params => this.router.navigate(['/distributor'], { replaceUrl: true }));
      } else {
        this.route.queryParams.subscribe(params => this.router.navigate([params.redirect || ''], { replaceUrl: true }));
      }
    } else {
      /**
       * Variables
       */
      const signupButton = document.getElementById('signup-button'),
        loginButton = document.getElementById('login-button'),
        userForms = document.getElementById('user_options-forms');

      /**
       * Add event listener to the "Sign Up" button
       */
      signupButton.addEventListener(
        'click',
        () => {
          this.typeForm = 'sign-up';
          userForms.classList.remove('bounceRight');
          userForms.classList.add('bounceLeft');
        },
        false
      );

      /**
       * Add event listener to the "Login" button
       */
      loginButton.addEventListener(
        'click',
        () => {
          this.typeForm = 'login';
          userForms.classList.remove('bounceLeft');
          userForms.classList.add('bounceRight');
        },
        false
      );
    }

    // OTP code
    // let obj = document.getElementById('partitioned');
    // obj.addEventListener('keydown', this.stopCarret);
    // obj.addEventListener('keyup', this.stopCarret);
  }

  stopCarret(obj: any) {
    if (obj.value.length > 3) {
      this.setCaretPosition(obj, 3);
    }
  }

  setCaretPosition(elem: any, caretPos: any) {
    if (elem != null) {
      if (elem.createTextRange) {
        var range = elem.createTextRange();
        range.move('character', caretPos);
        range.select();
      } else {
        if (elem.selectionStart) {
          // elem.focus();
          elem.setSelectionRange(caretPos, caretPos);
        } else elem.focus();
      }
    }
  }

  onMouseEnter() {
    this.showMobileIconClosed = true;
    document.querySelector('.login-wrapper').classList.add('login-page-wrapper');
  }

  onMouseLeave() {
    this.showMobileIconClosed = false;
    document.querySelector('.login-wrapper').classList.remove('login-page-wrapper');
  }

  openLogin(formType: string) {
    this.form_type = formType;
    event.stopPropagation();
    this.loginMobileOpen ? this.onMouseLeave() : this.onMouseEnter();
    this.loginMobileOpen = !this.loginMobileOpen;
  }

  login() {
    this.isLoading = true;
    this.authenticationService
      .login(this.loginForm.value)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        credentials => {
          console.log('yolo mf: ', credentials);
          this.authenticationService.setCredentials(credentials);
          // this.userInfo();
          log.debug(`${credentials.user} successfully logged in`);
          const roleType = this.authenticationService.permissionView();
          const onboard = this.authenticationService.onboardingView();
          console.log('onboardingView mf: ', onboard);
          if (roleType === 'salesman' && onboard) {
            this.route.queryParams.subscribe(params => this.router.navigate(['/salesman'], { replaceUrl: true }));
          } else if (roleType === 'retailer' && onboard) {
            this.route.queryParams.subscribe(params => this.router.navigate(['/retailer/home'], { replaceUrl: true }));
          } else if (roleType === 'distributor' && onboard) {
            this.route.queryParams.subscribe(params =>
              this.router.navigate(['/distributor/home'], { replaceUrl: true })
            );
          } else if (!onboard) {
            console.log('Working');
            this.route.queryParams.subscribe(params => this.router.navigate(['/boarding'], { replaceUrl: true }));
          } else {
            this.route.queryParams.subscribe(params =>
              this.router.navigate([params.redirect || ''], { replaceUrl: true })
            );
          }
        },
        error => {
          log.debug(`Login error: ${error}`);
          console.log(error, 'Error');
          this.LoginErrorMessage = error;
        }
      );
  }

  // public userInfo(): void {
  //   this.authenticationService.userInfo().subscribe(
  //     (data: any) => {
  //       localStorage.setItem('userInfo', JSON.stringify(data));
  //     },
  //     error => {
  //       log.debug(`Login user info error: ${error}`);
  //       console.log(error, 'Error');
  //       this.error = error;
  //     }
  //   );
  // }

  signUp() {
    let values = this.signUpForm.value;
    localStorage.setItem('user-email', this.signUpForm.value.email);
    this.isLoading = true;
    this.authenticationService
      .signup(this.signUpForm.value)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        data => {
          log.debug(`${data} successfully logged in`);
          this.signUpData = data;
          this.show_otp_form = true;

          // this.onBoardingSuccess = true;
          // this.signUpForm.reset();
          // setTimeout(function() {
          //   this.onBoardingSuccess = false;
          // }, 2000);
          // return this.LoginService.login(this.loginForm.value).subscribe(result => {
          //   console.log(result, 'result');
          //   this.route.queryParams.subscribe(params =>
          //     this.router.navigate([params.redirect || '/'], { replaceUrl: true })
          //   );
          // });
        },
        error => {
          log.debug(`Login error: ${error}`);
          this.signuperrorregistered = error.error['email_registered'];
          this.signuperrorexists = error.error['email_exists'];
          this.signuperrorphonenumber = error.error['phone_number'];
        }
      );
  }

  backFromOTP() {
    this.show_otp_form = false;
  }

  resendOnboardingEmail() {
    const resendBoardingEmailAddress = localStorage.getItem('user-email');
    this.authenticationService
      .resend_boarding_email(resendBoardingEmailAddress)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        data => {
          this.onBoardingSuccess = true;
          this.signUpForm.reset();
          setTimeout(function() {
            this.onBoardingSuccess = false;
          }, 2000);
          // return this.LoginService.login(this.loginForm.value).subscribe(result => {
          //   console.log(result, 'result');
          //   this.route.queryParams.subscribe(params =>
          //     this.router.navigate([params.redirect || '/'], { replaceUrl: true })
          //   );
          // });
        },
        error => {
          log.debug(`Login error: ${error}`);
          console.log(this.error, 'this.error');
        }
      );
  }

  submitOTP() {
    this.isLoading = true;
    const data = {
      one_time_token: this.signUpData['one_time_token'],
      otp: this.otp_code
    };
    this.authenticationService
      .verify_signup_otp(data)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        data => {
          this.show_otp_form = false;
          this.onBoardingSuccess = true;
          this.signUpForm.reset();
          // setTimeout(()=>{    //<<<---    using ()=> syntax
          //   this.onBoardingSuccess = false;
          // }, 3000);
          // return this.LoginService.login(this.loginForm.value).subscribe(result => {
          //   console.log(result, 'result');
          //   this.route.queryParams.subscribe(params =>
          //     this.router.navigate([params.redirect || '/'], { replaceUrl: true })
          //   );
          // });
        },
        error => {
          log.debug(`Login error: ${error}`);
          this.otp_error = error.error;
          console.log(this.error, 'this.error');
        }
      );
  }

  resendOtpCode() {
    const data = {
      one_time_token: this.signUpData['one_time_token']
    };
    this.authenticationService
      .resend_signup_otp(data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        data => {
          this.signUpForm.reset();
        },
        error => {
          log.debug(`Login error: ${error}`);
          this.otp_error = error.error;
          console.log(this.error, 'this.error');
        }
      );
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  forgetPassword() {
    this.typeForm = 'login';
    this.setForgetPass = !this.setForgetPass;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  forget() {
    this.ForgetPasswordErrorMessage = '';

    this.forgrt_email_sent = false;
    console.log('this.loginForm.value', this.forgetPasswordForm.value);
    this.isLoading = true;
    this.error = null;
    const values = this.forgetPasswordForm.value;
    this.LoginService.forgot(values)
      .pipe(
        finalize(() => {
          this.forgetPasswordForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        data => {
          this.forgrt_email_sent = true;
        },
        error => {
          log.debug(`Login error: ${error}`);
          this.ForgetPasswordErrorMessage = error;
        }
      );
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      // username: ['', Validators.required],
      email: ['', [Validators.required()]],
      password: ['', [Validators.required(), Validators.minLength(6)]]
    });
    this.forgetPasswordForm = this.formBuilder.group({
      email: ['', Validators.required]
    });
    this.signUpForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.email()]],
      phone_number: ['', [Validators.ValidatePhoneNumber()]],
      user_role: ['retailer', Validators.required()]
    });
  }
}
