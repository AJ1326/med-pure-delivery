import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService,
    private LoginService: LoginService
  ) {
    this.createForm();
  }

  ngOnInit() {
    const role = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (role) {
      const roleType = this.authenticationService.permissionView();
      if (roleType === 'retailer_role') {
        this.route.queryParams.subscribe(params => this.router.navigate(['/retailer'], { replaceUrl: true }));
      } else if (roleType === 'distributor_role') {
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
          userForms.classList.remove('bounceLeft');
          userForms.classList.add('bounceRight');
        },
        false
      );
    }
  }

  // var open = false;
  //
  onMouseEnter() {
    document.querySelector('.login-wrapper').classList.add('login-page-wrapper');
  }

  onMouseLeave() {
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
          if (roleType === 'retailer_role' && onboard) {
            this.route.queryParams.subscribe(params => this.router.navigate(['/retailer'], { replaceUrl: true }));
          } else if (roleType === 'distributor_role' && onboard) {
            this.route.queryParams.subscribe(params => this.router.navigate(['/distributor'], { replaceUrl: true }));
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
          this.error = error;
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
    console.log(this.signUpForm.value);
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
          this.error = error;
        }
      );
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  forgetPassword() {
    this.setForgetPass = !this.setForgetPass;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  forget() {
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
          this.error = error;
        }
      );
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      // username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.forgetPasswordForm = this.formBuilder.group({
      email: ['', Validators.required]
    });
    this.signUpForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      phone_number: ['', Validators.required],
      user_type: ['']
    });
  }
}
