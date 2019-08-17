import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService, I18nService } from '@app/core';
import { style } from '@angular/animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProviderDataValidators as Validators } from '@app/modules/data-valiidator';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { OnboardingService } from '@app/shell/onboarding/onboarding.service';
import { Subscription } from 'rxjs';
import * as csc from 'country-state-city';

@Component({
  selector: 'app-on-boarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OnboardingComponent implements OnInit {
  currentTab = 0; // Current tab is set to be the first tab (0)
  onBoardingForm: FormGroup;
  submitted = false;
  birthdate = { year: '0', month: '0', day: '0' };
  minDate: NgbDateStruct = {
    year: 1970,
    month: 1,
    day: 1
  };
  loading = false;
  verification_code: string;
  user_initial_data: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private calendar: NgbCalendar,
    private onboardingService: OnboardingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.route.params.subscribe(params => {
      this.verification_code = params['id'];
      this.onboardingService.check_url(this.verification_code).subscribe(data => {
        this.user_initial_data = data;
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
            state: [data['state'] ? data['state'] : 'Maharashtra', Validators.required()],
            zip_code: [data['zip_code'] ? data['zip_code'] : '', [Validators.required(), Validators.validZipCode()]],
            password1: [data['password1'] ? data['password1'] : '', [Validators.required(), Validators.minLength(8)]],
            // tslint:disable-next-line: max-line-length
            password2: [data['password2'] ? data['password2'] : '', [Validators.required(), Validators.minLength(8)]]
          },
          {
            validator: this.MustMatch('password1', 'password2')
          }
        );
        this.loading = false;
        setTimeout(() => this.showTab(this.currentTab), 1000);
        // Display the current tab
      });
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

  f() {
    return this.onBoardingForm.controls;
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
    this.onboardingService.sign_up(user_data).subscribe(data => {
      console.log('submit form data:', data);
      this.router.navigate(['/login'], { queryParams: { from: 'onboarding' } });
    });

    alert('SUCCESS!! :-)');
  }

  showTab(n: any): void {
    // This function will display the specified tab of the form ...
    const x = document.getElementsByClassName('tab') as HTMLCollectionOf<HTMLElement>;
    x[n].style.display = 'block';
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
      x[this.currentTab - n].style.display = 'none';
    }
    // Otherwise, display the correct tab:
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
}
