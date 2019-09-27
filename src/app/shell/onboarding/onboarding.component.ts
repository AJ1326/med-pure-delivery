import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService, I18nService } from '@app/core';
import { style } from '@angular/animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProviderDataValidators as Validators } from '@app/modules/data-valiidator';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { OnboardingService } from '@app/shell/onboarding/onboarding.service';
import { Subscription } from 'rxjs';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import * as _ from 'lodash';

@Component({
  selector: 'app-on-boarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  currentTab = 0; // Current tab is set to be the first tab (0)
  tab_submitted = false;
  onBoardingForm: FormGroup;
  submitted = false;
  page_error: string | null = null;
  birthdate: NgbDateStruct = { year: 2000, month: 1, day: 1 };
  minDate: NgbDateStruct = {
    year: 1970,
    month: 1,
    day: 1
  };
  maxDate: NgbDateStruct;
  loading = false;
  verification_code: string;
  user_initial_data: any;
  tab_display = ['none', 'none', 'none', 'none', 'none'];
  onb_error: any = {
    first_name: '',
    last_name: '',
    dob: '',
    email: '',
    phone_number: '',
    address_line_1: '',
    address_line_2: '',
    shop_name: '',
    certificate_no: '',
    city: '',
    state: '',
    zip_code: '',
    password1: '',
    password2: '',
    tnc: ''
  };
  error_helper_dict = {
    first_name: 0,
    last_name: 0,
    dob: 1,
    email: 2,
    phone_number: 2,
    address_line_1: 3,
    address_line_2: 3,
    shop_name: 3,
    certificate_no: 3,
    city: 3,
    state: 3,
    zip_code: 3,
    password1: 4,
    password2: 4,
    tnc: 4
  };
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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private calendar: NgbCalendar,
    private onboardingService: OnboardingService,
    private router: Router
  ) {
    let today: any = new Date();
    today = +today.getFullYear() - 12;
    this.maxDate = {
      year: today,
      month: 12,
      day: 31
    };
    setTimeout(() => {
      this.userSettings['inputPlaceholderText'] = 'Shop location.';
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
      this.onBoardingForm.controls['zip_code'].setValue(this.zipcode_value ? this.zipcode_value['long_name'] : '');
      this.onBoardingForm.controls['state'].setValue(this.state_value ? this.state_value['long_name'] : '');
      this.onBoardingForm.controls['city'].setValue(this.city_value ? this.city_value['long_name'] : '');
      this.onBoardingForm.controls['address_line_2'].setValue(selectedData.data['description']);
    } else {
      this.invalidLocation = true;
    }
  }

  ngOnInit() {
    this.loading = true;
    this.route.params.subscribe(params => {
      this.verification_code = params['id'];
      this.onboardingService.check_url(this.verification_code).subscribe(
        data => {
          this.user_initial_data = data;
          this.build_form(data);
          this.loading = false;
          setTimeout(() => this.showTab(this.currentTab), 1000);
          // Display the current tab
        },
        error => {
          this.page_error = error.error.error;
        }
      );
    });
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  submitForm() {
    this.submitted = true;

    // this.onBoardingForm.setValue({
    //   dob: this.birthdate.year + this.birthdate.month + this.birthdate.day
    // });
    console.log('form data: ', this.onBoardingForm.value);
    // stop here if form is invalid
    const user_data = Object.assign(
      {
        validator_hash: this.verification_code
      },
      this.user_initial_data
    );
    Object.assign(user_data, this.onBoardingForm.value);
    delete user_data['id'];
    delete user_data['used'];
    if (this.onBoardingForm.invalid) {
      return;
    }
    this.onboardingService.sign_up(user_data).subscribe(
      data => {
        console.log('submit form data:', data);
        this.router.navigate(['/login'], { queryParams: { from: 'onboarding' } });
      },
      error => {
        const x = document.getElementsByClassName('tab') as HTMLCollectionOf<HTMLElement>;
        let min_tab = x.length + 1;
        // tslint:disable-next-line: forin
        for (const a in error.error) {
          if (min_tab > this.error_helper_dict[a]) {
            min_tab = this.error_helper_dict[a];
          }
          if (typeof error.error[a] === typeof []) {
            this.onb_error[a] = error.error[a].join('. ');
          } else {
            this.onb_error[a] = error.error[a];
          }
        }
        this.tab_display[this.currentTab] = 'none';
        this.currentTab = min_tab;
        this.showTab(this.currentTab);
      }
    );
  }

  showTab(n: any): void {
    // This function will display the specified tab of the form ...
    const x = document.getElementsByClassName('tab') as HTMLCollectionOf<HTMLElement>;
    this.tab_display[n] = 'block';
    // ... and fix the Previous/Next buttons:
    if (n === 0) {
      document.getElementById('prevBtn').style.display = 'none';
    } else {
      document.getElementById('prevBtn').style.display = 'inline';
    }
    if (n === x.length - 1) {
      document.getElementById('nextBtn').innerHTML = 'Save';
    } else {
      document.getElementById('nextBtn').innerHTML = 'Next';
    }
    // ... and run a function that displays the correct step indicator:
    this.fixStepIndicator(n);
  }

  nextPrev(n: any) {
    console.log('this.currentTab: ', this.currentTab);

    this.tab_submitted = true;
    console.log(this.onBoardingForm);
    // This function will figure out which tab to display
    const x = document.getElementsByClassName('tab') as HTMLCollectionOf<HTMLElement>;
    // Exit the function if any field in the current tab is invalid:

    if (n === 1 && !this.validateForm(document)) {
      return false;
    }
    // Hide the current tab:

    // Increase or decrease the current tab by 1:
    this.currentTab = this.currentTab + n;
    // if you have reached the end of the form... :
    if (this.currentTab >= x.length) {
      this.submitForm();
      this.currentTab = this.currentTab - n;
      // ...the form gets submitted:
      // document.getElementById('regForm').submit();
      console.log('Form is submitted !!!!!!!!');
      return false;
    } else {
      this.tab_display[this.currentTab - n] = 'none';
    }
    // Otherwise, display the correct tab:
    this.tab_submitted = false;

    this.showTab(this.currentTab);
  }

  validateForm(document: any = null) {
    // This function deals with validation of the form fields
    let x,
      y,
      i,
      refetch = false,
      valid = true;
    x = document.getElementsByClassName('tab');
    console.log('tabs:', x);
    console.log(this.currentTab);
    y = x[this.currentTab].getElementsByTagName('input');

    for (i = 0; i < y.length; i++) {
      if (y[i].getAttribute('formControlName') === 'dob') {
        refetch = true;
        this.onBoardingForm.controls['dob'].setValue(
          this.birthdate.year + '-' + this.birthdate.month + '-' + this.birthdate.day,
          {
            emitModelToViewChange: true,
            emitEvent: false
          }
        );
      }
    }

    if (refetch) {
      x = document.getElementsByClassName('tab');
      y = x[this.currentTab].getElementsByTagName('input');
    }

    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
      // If a field is empty.
      console.log('kkkkk: ', y[i].getAttribute('formControlName'), y[i]);
      if (y[i].getAttribute('formControlName')) {
        const element_control = this.onBoardingForm.controls[y[i].getAttribute('formControlName')];
        element_control.markAsTouched({ onlySelf: true });
        try {
        } catch (error) {
          valid = false;
        }
        if (y[i].value === '' || element_control.invalid) {
          // add an 'invalid' class to the field:
          y[i].className += 'invalid';
          // and set the current valid status to false:
          valid = false;
        }
      }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
      document.getElementsByClassName('step')[this.currentTab].className += ' finish';
    }
    return valid; // return the valid status
  }

  fixStepIndicator(n: any) {
    // This function removes the 'active' class of all steps...
    let i,
      x = document.getElementsByClassName('step');
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(' active', '');
    }
    // ... and adds the 'active' class to the current step:
    x[n].className += ' active';
  }

  build_form(data: any) {
    if (data['user_role'] === 'salesman') {
      this.onBoardingForm = this.formBuilder.group(
        {
          first_name: [data['first_name'] ? data['first_name'] : '', Validators.required()],
          last_name: [data['last_name'] ? data['last_name'] : '', Validators.required()],
          dob: ['', Validators.completeDate()],
          email: [data['email'] ? data['email'] : '', [Validators.required(), Validators.email()]],
          phone_number: [data['phone_number'] ? data['phone_number'] : '', Validators.required()],
          address_line_1: [data['address_line_1'] ? data['address_line_1'] : ''],
          address_line_2: [data['address_line_2'] ? data['address_line_2'] : ''],
          city: [data['city'] ? data['city'] : '', Validators.required()],
          state: [data['state'] ? data['state'] : '', Validators.required()],
          zip_code: [data['zip_code'] ? data['zip_code'] : '', [Validators.required(), Validators.validZipCode()]],
          password1: [data['password1'] ? data['password1'] : '', [Validators.required(), Validators.minLength(8)]],
          // tslint:disable-next-line: max-line-length
          password2: [data['password2'] ? data['password2'] : '', [Validators.required(), Validators.minLength(8)]],
          tnc: [false, [Validators.requiredTrue()]]
        },
        {
          validator: this.MustMatch('password1', 'password2')
        }
      );
    } else {
      this.onBoardingForm = this.formBuilder.group(
        {
          first_name: [data['first_name'] ? data['first_name'] : '', Validators.required()],
          last_name: [data['last_name'] ? data['last_name'] : '', Validators.required()],
          dob: ['', Validators.completeDate()],
          email: [data['email'] ? data['email'] : '', [Validators.required(), Validators.email()]],
          phone_number: [data['phone_number'] ? data['phone_number'] : '', Validators.required()],
          address_line_1: [data['address_line_1'] ? data['address_line_1'] : '', Validators.required()],
          address_line_2: [data['address_line_2'] ? data['address_line_2'] : '', Validators.required()],
          shop_name: [data['shop_name'] ? data['shop_name'] : '', Validators.required()],
          certificate_no: [data['certificate_no'] ? data['certificate_no'] : '', Validators.required()],
          city: [data['city'] ? data['city'] : '', Validators.required()],
          state: [data['state'] ? data['state'] : '', Validators.required()],
          zip_code: [data['zip_code'] ? data['zip_code'] : '', [Validators.required(), Validators.validZipCode()]],
          password1: [data['password1'] ? data['password1'] : '', [Validators.required(), Validators.minLength(8)]],
          // tslint:disable-next-line: max-line-length
          password2: [data['password2'] ? data['password2'] : '', [Validators.required(), Validators.minLength(8)]],
          tnc: [false, [Validators.requiredTrue()]]
        },
        {
          validator: this.MustMatch('password1', 'password2')
        }
      );
    }
  }
}
