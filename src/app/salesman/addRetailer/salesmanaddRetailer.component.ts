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
import * as _ from 'lodash';

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
  // show_otp_form = false;
  otp_code: number;
  signUpData: any;
  otp_error: any;
  onBoardingSuccess = false;
  signuperrorregistered: string;
  signuperrorexists: string;
  signuperrorphonenumber: string;
  //retailer sign up ends
  error: any;
  //Geo location
  public componentData4: any = '';
  public userSettings = {
    showCurrentLocation: false,
    showSearchButton: false,
    currentLocIconUrl: 'https://cdn4.iconfinder.com/data/icons/proglyphs-traveling/512/Current_Location-512.png',
    locationIconUrl: 'http://www.myiconfinder.com/uploads/iconsets/369f997cef4f440c5394ed2ae6f8eecd.png',
    recentStorageName: 'componentData4',
    noOfRecentSearchSave: 3,
    geoCountryRestriction: ['in']
  };
  zipcode_value = '';
  state_value = '';
  city_value = '';
  invalidLocation = false;

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
    setTimeout(() => {
      this.userSettings['inputPlaceholderText'] = 'Address line 1';
      this.userSettings = Object.assign({}, this.userSettings);
    }, 5000);
  }

  autoCompleteCallback1(selectedData: any) {
    this.zipcode_value = _.find(selectedData.data['address_components'], function(data_type: any) {
      return data_type['types'][0] === 'postal_code';
    });
    this.state_value = _.find(selectedData.data['address_components'], function(data_type: any) {
      return data_type['types'][0] === 'administrative_area_level_1';
    });
    this.city_value = _.find(selectedData.data['address_components'], function(data_type: any) {
      return data_type['types'][0] === 'administrative_area_level_2';
    });
    if (this.zipcode_value && this.state_value && this.city_value) {
      this.invalidLocation = false;
      this.signUpRetailerForm.controls['zip_code'].setValue(this.zipcode_value ? this.zipcode_value['long_name'] : '');
      this.signUpRetailerForm.controls['state'].setValue(this.state_value ? this.state_value['long_name'] : '');
      this.signUpRetailerForm.controls['city'].setValue(this.city_value ? this.city_value['long_name'] : '');
      this.signUpRetailerForm.controls['address_line_2'].setValue(selectedData.data['description']);
    } else {
      this.invalidLocation = true;
    }
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
      one_time_token: this.signUpData['one_time_token'],
      otp: this.otp_code
    };
    this.authenticationService
      .verify_signup_otp_by_salesman(data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        data => {
          // this.show_otp_form = false;
          this.onBoardingSuccess = true;
          this.signUpRetailerForm.reset();
          this.modalService.dismissAll('done');
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
      .signupRetailerBySalesman(this.signUpRetailerForm.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        data => {
          log.debug(`${data} successfully logged in`);
          this.signUpData = data;
          // this.show_otp_form = true;
          this.modalService.open(content);
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
          this.isLoading = false;
          this.signuperrorregistered = error.error['email_registered'];
          this.signuperrorexists = error.error['email'];
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
      gender: ['', Validators.required()],
      address_line_1: ['', Validators.required()],
      address_line_2: ['', Validators.required()],
      shop_name: ['', Validators.required()],
      city: ['', Validators.required()],
      state: ['', Validators.required()],
      zip_code: ['', [Validators.required(), Validators.validZipCode()]]
    });
  }

  resetAddRetailerForm(): void {
    this.signUpRetailerForm.reset();
  }
}
