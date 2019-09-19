import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbdSortableHeader } from '@app/shared/directives/sortable.directive';
import { DecimalPipe } from '@angular/common';
import { AuthenticationService, I18nService, Logger } from '@app/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TableDataService } from '@app/shared/tableData/tableData.service';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, switchMap, tap } from 'rxjs/operators';
import { SalesmanService } from '@app/salesman/salesman.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProviderDataValidators as Validators } from '@app/modules/data-valiidator';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('Salesman home');

@Component({
  selector: 'app-sales-man-home',
  templateUrl: './salesmanaddRetailer.component.html',
  styleUrls: ['./salesmanaddRetailer.component.scss'],
  providers: [DecimalPipe]
})
export class SalesmanaddRetailerComponent implements OnInit {
  isLoading = false;
  closeResult: string;
  //User info
  user_info: any = [];
  role_type: string;
  //User info ends
  //Retailer sign up
  signUpRetailerForm: FormGroup;
  show_otp_form = false;
  otp_code: number;
  signUpData: any;
  otp_error: any;
  onBoardingSuccess = false;
  signuperrorregistered: string;
  signuperrorexists: string;
  signuperrorphonenumber: string;
  //retailer sign up ends
  error: any;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    config: NgbModalConfig,
    public activeModal: NgbActiveModal,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private salesmanService: SalesmanService
  ) {
    this.createForm();
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.user_info = this.authenticationService.userInfo();
    this.role_type = this.user_info.roles[0];
    const pageURL = window.location.href;
    const lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);
    if (this.role_type === 'retailer') {
    } else {
    }
  }

  public openModal(content: any) {
    this.retailersignUp(content);
  }

  submitOTP() {
    this.isLoading = true;
    const data = {
      otp_uuid: this.signUpData['otp_uuid'],
      otp: this.otp_code
    };
    this.authenticationService
      .verify_signup_otp(data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        data => {
          this.show_otp_form = false;
          this.onBoardingSuccess = true;
          this.signUpRetailerForm.reset();
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
      otp_uuid: this.signUpData['otp_uuid']
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
          this.signUpRetailerForm.reset();
        },
        error => {
          log.debug(`Login error: ${error}`);
          this.otp_error = error.error;
          console.log(this.error, 'this.error');
        }
      );
  }

  retailersignUp(content: any) {
    console.log('working');
    let values = this.signUpRetailerForm.value;
    localStorage.setItem('user-email', this.signUpRetailerForm.value.email);
    this.isLoading = true;
    this.authenticationService
      .signup(this.signUpRetailerForm.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        data => {
          log.debug(`${data} successfully logged in`);
          this.signUpData = data;
          this.show_otp_form = true;
          // this.onBoardingSuccess = true;
          // this.signUpRetailerForm.reset();
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
          this.modalService.open(content);
          this.isLoading = false;
          this.signuperrorregistered = error.error['email_registered'];
          this.signuperrorexists = error.error['email_exists'];
          this.signuperrorphonenumber = error.error['phone_number'];
        }
      );
  }

  private createForm() {
    this.signUpRetailerForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.email()]],
      phone_number: ['', [Validators.ValidatePhoneNumber()]],
      gender: ['retailer', Validators.required()],
      address_line_1: ['', Validators.required()],
      address_line_2: [''],
      shop_name: ['', Validators.required()],
      city: ['', Validators.required()],
      state: ['Maharashtra', Validators.required()],
      zip_code: ['', [Validators.required(), Validators.validZipCode()]]
    });
  }

  resetAddRetailerForm(): void {
    this.signUpRetailerForm.reset();
  }
}

// @Component({
//   selector: 'ngbd-modal-content',
//   template: `<div class="modal-header">
//       <h4 class="modal-title">OTP</h4>
//       <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
//           <span aria-hidden="true">&times;</span>
//       </button>
//   </div>
//   <div class="modal-body">
//       <p>Please enter the otp.</p>
//
//   </div>
//   <div class="modal-footer">
//       <button
//               type="button"
//               class="btn btn-primary btn-fw forms_buttons-action"
//       >
//           <span [hidden]="!isLoading">
//             Submit
//           </span>
//           <span>
//             <i class="fas fa-cog fa-spin" [hidden]="isLoading"></i>
//           </span>
//       </button>
//       <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
//   </div> `
// })
// export class NgbdModalContent {
//   constructor(public activeModal: NgbActiveModal) {}
//
// }
