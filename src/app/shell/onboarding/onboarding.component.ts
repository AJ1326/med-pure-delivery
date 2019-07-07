import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, I18nService } from '@app/core';
import { style } from '@angular/animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProviderDataValidators as Validators } from '@app/modules/data-valiidator';
import { invalid } from '@angular/compiler/src/render3/view/util';

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

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.showTab(this.currentTab); // Display the current tab
    this.onBoardingForm = this.formBuilder.group({
      firstName: ['', Validators.required()],
      lastName: ['', Validators.required()],
      day: ['', Validators.required()],
      month: ['', Validators.required()],
      year: ['', Validators.required()],
      email: ['', [Validators.required(), Validators.email()]],
      phone_number: ['', Validators.required()],
      address: ['', Validators.required()],
      shop_number: ['', Validators.required()],
      certification_number: ['', Validators.required()],
      city: ['', Validators.required()],
      state: ['', Validators.required()],
      zip_code: ['', [Validators.required(), Validators.validZipCode()]],
      user_name: ['', Validators.required()],
      password: ['', [Validators.required(), Validators.minLength(6)]],
      confirm_password: ['', [Validators.required(), Validators.minLength(6)]]
    });
  }

  f() {
    return this.onBoardingForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.onBoardingForm.invalid) {
      return;
    }

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
    if (n === 1 && !this.validateForm()) return false;
    // Hide the current tab:
    x[this.currentTab].style.display = 'none';
    // Increase or decrease the current tab by 1:
    this.currentTab = this.currentTab + n;
    // if you have reached the end of the form... :
    if (this.currentTab >= x.length) {
      // ...the form gets submitted:
      console.log('this.onBoardingForm.invalid', this.onBoardingForm);
      // document.getElementById('regForm').submit();
      console.log('Form is submitted !!!!!!!!');
      return false;
    }
    // Otherwise, display the correct tab:
    this.showTab(this.currentTab);
  }

  validateForm() {
    // This function deals with validation of the form fields
    let x,
      y,
      i,
      valid = true;
    x = document.getElementsByClassName('tab');
    y = x[this.currentTab].getElementsByTagName('input');
    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
      // If a field is empty.
      const element_control = this.onBoardingForm.controls[y[i].getAttribute('formControlName')];
      element_control.markAsTouched({ onlySelf: true });
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
