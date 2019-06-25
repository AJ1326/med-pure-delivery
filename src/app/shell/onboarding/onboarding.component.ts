import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, I18nService } from '@app/core';
import { style } from '@angular/animations';

@Component({
  selector: 'app-on-boarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  currentTab = 0; // Current tab is set to be the first tab (0)

  constructor() {}

  ngOnInit() {
    console.log('working!!!!!!!');
    this.showTab(this.currentTab); // Display the current tab
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
      // If a field is empty...
      if (y[i].value === '') {
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
