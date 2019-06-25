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
    let role = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (role) {
      const roleType = this.authenticationService.permissionView();
      if (roleType === 'retailer_role') {
        console.log('in retial');
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

  login() {
    console.log('this.loginForm.value', this.loginForm.value);
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
          log.debug(`${credentials.email} successfully logged in`);
          const roleType = this.authenticationService.permissionView();
          const onboard = this.authenticationService.onboardingView();
          // console.log('onboardingView mf: ', onboard);
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

  signUp() {
    console.log('this.loginForm.value', this.signUpForm.value);
    this.isLoading = true;
    this.authenticationService
      .login(this.signUpForm.value)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        credentials => {
          log.debug(`${credentials.email} successfully logged in`);
          return this.LoginService.login(this.loginForm.value).subscribe(result => {
            console.log(result, 'result');
            this.route.queryParams.subscribe(params =>
              this.router.navigate([params.redirect || '/'], { replaceUrl: true })
            );
          });
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
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
}
