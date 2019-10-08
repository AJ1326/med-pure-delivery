import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';

const log = new Logger('Add salesman by distributor');

import { finalize } from 'rxjs/operators';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService, I18nService, Logger } from '@app/core';
import { SalesmanService } from '@app/salesman/salesman.service';
import * as _ from 'lodash';
import { ProviderDataValidators as Validators } from '@app/modules/data-valiidator';
import { NgbdSortableHeader } from '@app/shared/directives/sortable.directive';

@Component({
  selector: 'add-salesman-by-distributor',
  templateUrl: './add-salesman.component.html',
  styleUrls: ['./add-salesman.component.scss']
})
export class AddSalesmanComponent implements OnInit {
  isLoading = false;

  //User info
  user_info: any = [];
  role_type: string;

  //Retailer sign up
  signUpSalesmanForm: FormGroup;
  otp_code: number;
  signUpData: any;
  otp_error: any;
  onBoardingSuccess = false;
  signuperrorregistered: string;
  signuperrorexists: string;
  error: any = {
    first_name: '',
    last_name: '',
    gender: '',
    email: '',
    phone_number: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    zip_code: ''
  };

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

  @Input() orderListByFilterData: string;
  @Output() all_csv_downloaded = new EventEmitter<boolean>();
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
      this.userSettings['inputPlaceholderText'] = 'Please enter nearest landmark.';
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
      this.signUpSalesmanForm.controls['zip_code'].setValue(this.zipcode_value ? this.zipcode_value['long_name'] : '');
      this.signUpSalesmanForm.controls['state'].setValue(this.state_value ? this.state_value['long_name'] : '');
      this.signUpSalesmanForm.controls['city'].setValue(this.city_value ? this.city_value['long_name'] : '');
      this.signUpSalesmanForm.controls['address_line_2'].setValue(selectedData.data['description']);
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
          this.onBoardingSuccess = true;
          this.signUpSalesmanForm.reset();
          this.modalService.dismissAll('done');
        },
        error => {
          log.debug(`Login error: ${error}`);
          this.otp_error = error.error;
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
          this.signUpSalesmanForm.reset();
        },
        error => {
          log.debug(`Login error: ${error}`);
          this.otp_error = error.error;
        }
      );
  }

  retailersignUp(content: any) {
    let values = this.signUpSalesmanForm.value;
    localStorage.setItem('user-email', this.signUpSalesmanForm.value.email);
    this.isLoading = true;
    this.authenticationService
      .signupSalesmanByDistributor(this.signUpSalesmanForm.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        data => {
          log.debug(`${data} successfully logged in`);
          this.signUpData = data;
          this.modalService.open(content);
        },
        error => {
          log.debug(`Login error: ${error}`);
          this.isLoading = false;
          this.error = error.error;
          // this.signuperrorregistered = error.error['email_registered'];
          // this.signuperrorexists = error.error['email'];
        }
      );
  }

  private createForm() {
    this.signUpSalesmanForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.email()]],
      phone_number: ['', [Validators.ValidatePhoneNumber()]],
      gender: ['', Validators.required()],
      address_line_1: ['', Validators.required()],
      address_line_2: ['', Validators.required()],
      city: ['', Validators.required()],
      state: ['', Validators.required()],
      zip_code: ['', [Validators.required(), Validators.validZipCode()]]
    });
  }

  resetAddRetailerForm(): void {
    this.signUpSalesmanForm.reset();
  }
}
