import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

const stayInCountryRegexp = RegExp('^\\[[\'"][0-9]+ +days[\'"],[\'"][0-9]+ days[\'"]\\)$');

const zipcodeRegexp = RegExp('^\\d{6}(?:[\\s]?[-\\s]?[\\s]?\\d{4})?$');

const yearRegexp = RegExp('null|^(19|20)\\d{2}$');

const time12FormatRegex = /^((0?[1-9])|10|11|12):[0-5][0-9](AM|PM)$/;

const time24FormatRegex = /^[0-2][0-9]:[0-5][0-9]:[0-5][0-9]$/;

const phoneNumberValidator = /^[0-9]{5,13}$/;

const onboardPasswordValidator = RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$!%*?&])[A-Za-z\\d@#$!%*?&]{8,}$');

const urlRegexp = new RegExp(
  '^' +
    // protocol identifier (optional)
    // short syntax // still required
    '(?:(?:(?:https?|ftp):)?\\/\\/)?' +
    // user:pass BasicAuth (optional)
    '(?:\\S+(?::\\S*)?@)?' +
    '(?:' +
    // IP address exclusion
    // private & local networks
    '(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
    '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
    '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broacast addresses
    // (first & last IP address of each class)
    '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
    '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
    '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
    '|' +
    // host & domain names, may end with dot
    // can be replaced by a shortest alternative
    // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
    '(?:' +
    '(?:' +
    '[a-z0-9\\u00a1-\\uffff]' +
    '[a-z0-9\\u00a1-\\uffff_-]{0,62}' +
    ')?' +
    '[a-z0-9\\u00a1-\\uffff]\\.' +
    ')+' +
    // TLD identifier name, may end with dot
    '(?:[a-z\\u00a1-\\uffff]{2,}\\.?)' +
    ')' +
    // port number (optional)
    '(?::\\d{2,5})?' +
    // resource path (optional)
    '(?:[/?#]\\S*)?' +
    '$',
  'i'
);

export interface DdValidationErrors {
  [key: string]: any;
}

export interface DdValidator {
  validate(value: any): DdValidationErrors | null;
  // registerOnValidatiorChange(fn: () => void): void
}

// export interface DdAsyncValidator extends DdValidator {
//     validate(value:any): Observable<DdValidationErrors | null>
// }

export class ProviderDataValidators {
  // return forbidden ? {'forbiddenName': {value: control.value}} : null;

  // TODO implement allowed chars in the input string
  static stringRequired(allowedChars: Array<string>): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value !== 'string') {
        return { stringRequired: { msg: 'String is required' } };
      }
      return null;
    };
  }

  static numberRequired(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      // Quick fix for failing cases in case of string in put
      const value = Number(control.value);
      if (!value || !Number.isFinite(value)) {
        return { numberRequired: { msg: 'Number is required.' } };
      }
      return null;
    };
  }

  static integerRequired(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = Number(control.value);
      if (!value || !Number.isInteger(value)) {
        return { integerRequired: { msg: 'Integer value is required.' } };
      }
      return null;
    };
  }

  static min(min: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = Number(control.value);
      if (!value || !Number.isInteger(value) || !Number.isFinite(value) || value < min) {
        return { min: { msg: 'Needs to be of ' + control.value + 'numbers.' } };
      }
      return null;
    };
  }

  static max(max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = Number(control.value);
      if (!value || !Number.isInteger(value) || !Number.isFinite(value) || value > max) {
        return {
          max: {
            msg: 'Exceeding the max value ' + control.value + '.',
            value: max
          }
        };
      }
      return null;
    };
  }

  // TODO if the condition is correct like this

  static required(msg = 'This field is required.'): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (
        control.value === '' ||
        control.value === undefined ||
        control.value === null ||
        control.value.toString().length === 0
      ) {
        return { required: { msg: msg } };
      } else if (control.value['id'] === null) {
        return { required: { msg: msg } };
      } else {
        return null;
      }
    };
  }

  static ageCheck(msg = 'This field is required.'): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const vals = control.value.split('-');
      const db = new Date(vals[0], vals[1] - 1, vals[2], 0, 0, 0, 0);
      const ageDifMs = Date.now() - db.getTime();
      const ageDate = new Date(ageDifMs); // miliseconds from epoch
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);

      console.log('aaa: ', age);

      if (
        age < 13 ||
        control.value === '' ||
        control.value === undefined ||
        control.value === null ||
        control.value.toString().length === 0
      ) {
        return { age: { msg: msg } };
      } else if (control.value['id'] === null) {
        return { age: { msg: msg } };
      } else {
        return null;
      }
    };
  }

  static completeDate(msg = 'This field is required.'): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const vals: any = [];
      control.value.split('-').forEach((element: any) => {
        if (element && element !== 0 && element !== undefined && element !== 'undefined') {
          console.log('added :', element);
          vals.push(element);
        }
      });
      if (
        vals.length < 3 ||
        control.value === '' ||
        control.value === undefined ||
        control.value === null ||
        control.value.toString().length === 0
      ) {
        return { required: { msg: msg } };
      } else if (control.value['id'] === null) {
        return { required: { msg: msg } };
      } else {
        return null;
      }
    };
  }

  static atleastOneContactType(msg = 'This field is required.'): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const contactTypeGroup = control as FormGroup;
      if (
        contactTypeGroup.controls &&
        contactTypeGroup.controls.contact_types &&
        contactTypeGroup.controls.contact_types.value &&
        contactTypeGroup.controls.contact_types.value.length < 1
      ) {
        return {
          atleastOneContactType: {
            msg: 'Please select atleast one contact type.'
          }
        };
      } else {
        return null;
      }
    };
  }

  static requiredTrue(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value !== 'boolean' || !control.value) {
        return { requiredTrue: { value: control.value } };
      } else {
        return null;
      }
    };
  }

  // static checkPasswords(group: FormGroup): ValidatorFn {
  //   const pass = group.controls.password.value;
  //   const confirmPass = group.controls.confirm_password.value;
  //   return (value: any): { [key: string]: any } | null => {
  //     if (pass === confirmPass) {
  //       return { requiredTrue: { value: value } };
  //     }
  //     return null;
  //   };

  static requiredFalse(): ValidatorFn {
    return (value: any): { [key: string]: any } | null => {
      if (typeof value !== 'boolean' || value) {
        return { requiredTrue: { value: value } };
      }
      return null;
    };
  }

  static email(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          control.value
        )
      ) {
        return { email: { msg: 'Invalid email address.' } };
      }
      return null;
    };
  }

  static url(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (urlRegexp.test(control.value)) {
        return null;
      } else {
        return { url: { msg: 'Please enter a valid url.' } };
      }
    };
  }

  static ValidatePhoneNumber(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (phoneNumberValidator.test(control.value)) {
        return null;
      } else {
        return { validPhoneNumber: { msg: 'Not a phone number.' } };
      }
    };
  }

  static ValidateNonMandatoryPhoneWithCountryCode(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }
      if (phoneNumberValidator.test(control.value)) {
        const parentForm: FormGroup = control.parent as FormGroup;
        if (parentForm && parentForm.controls.country_code && parentForm.controls.country_code.value === '') {
          parentForm.get('country_code').setErrors({ selectCountryCode: true });
        } else {
          return null;
        }
      } else {
        return { validPhoneNumber: { msg: 'Not a phone number.' } };
      }
    };
  }

  static ValidateOnboardPassword(control: AbstractControl) {
    if (!onboardPasswordValidator.test(control.value)) {
      return { correctFormat: true };
    } else {
      return null;
    }
  }

  static integerRangeValidator(
    rangeStartControlName: string,
    rangeEndControlName: string,
    errorKey = 'integerRange',
    additionalData?: any
  ): ValidatorFn {
    return (control: FormGroup): ValidationErrors | null => {
      const error = {};
      const rangeStart = control.get(rangeStartControlName);
      const rangeEnd = control.get(rangeEndControlName);
      let errorMessage = '';
      if (
        (Number.isInteger(rangeStart.value) && !Number.isInteger(rangeEnd.value)) ||
        (!Number.isInteger(rangeStart.value) && Number.isInteger(rangeEnd.value))
      ) {
        errorMessage = 'The value should be a range of days.';
        error[errorKey] = {
          msg: errorMessage
        };
        if (additionalData) {
          error[errorKey]['additionalData'] = additionalData;
        }
        return error;
      } else if (
        !Number.isInteger(rangeStart.value) ||
        !Number.isInteger(rangeEnd.value) ||
        rangeStart.value < rangeEnd.value
      ) {
        return null;
      } else {
        //   return  {'stayInCountry' : { 'msg': 'Start Day (' + rangeStart.value + ') can not be less than End Day (' + rangeEnd.value + ').' }};
        errorMessage = 'The range start must be less than the range end.';
        error[errorKey] = {
          msg: errorMessage
        };
        if (additionalData) {
          error[errorKey]['additionalData'] = additionalData;
        }
        return error;
      }
    };
  }

  static minLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value !== 'string' || control.value.length < minLength) {
        return {
          minLength: {
            msg: 'The given length is small than' + control.value.length + '.',
            number: minLength
          }
        };
      }
      return null;
    };
  }

  static minLengthOfArray(minLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value.length < minLength) {
        return {
          minLength: {
            msg: 'Number of entries is less than ' + minLength + '.',
            number: minLength
          }
        };
      }
      return null;
    };
  }

  static maxLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const inputLength: number = control.value !== null ? control.value.toString().length : -1;
      if (inputLength > maxLength) {
        return {
          maxLength: {
            msg: 'The given length is more than' + control.value.toString().length + '.',
            length: maxLength
          }
        };
      }
      return null;
    };
  }

  static alphaNumeric(): ValidatorFn {
    const regexp = new RegExp('^[0-9a-zA-Z]+$');
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!regexp.test(control.value)) {
        return {
          alphaNumeric: { msg: 'Only alphanumeric characters are allowed.' }
        };
      }
    };
  }

  static hptc(): ValidatorFn {
    const regexp = new RegExp('^[0-9A-Z]+$');
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!regexp.test(control.value)) {
        return {
          hptc: {
            msg: 'Only alphanumeric characters [A-Z] , [0-9] and dot [.] are allowed.'
          }
        };
      }
    };
  }

  static pattern(pattern: string | RegExp): ValidatorFn {
    let regexp: RegExp;

    if (typeof pattern === 'string') {
      regexp = new RegExp(pattern);
    }
    if (pattern instanceof RegExp) {
      regexp = pattern;
    } else {
      return (control: AbstractControl): { [key: string]: any } | null => {
        return null;
      };
    }

    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!regexp.test(control.value)) {
        return {
          pattern: { value: control.value, pattern: pattern.toString() }
        };
      } // The strings needs to be added in the above format.
      return null;
    };
  }

  // TODO: complete this
  static date(format = '<default-format>'): ValidatorFn {
    return (value: any): { [key: string]: any } | null => {
      // if (!regexp.test(value))
      //     return { 'pattern': {value:value, pattern:time.toString()} };
      return null;
    };
  }

  static time12(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!time12FormatRegex.test(control.value)) {
        return { time: { msg: 'Time format is incorrect. i.e 11:00PM' } };
      }
      return null;
    };
  }

  static time24(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!time24FormatRegex.test(control.value)) {
        return { time: { msg: 'Time format is incorrect. i.e 00:00:00' } };
      }
      return null;
    };
  }

  static validYearRequired(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!yearRegexp.test(control.value)) {
        return { year: { msg: 'Not a valid year.' } };
      }
      return null;
    };
  }

  static validZipCode(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!zipcodeRegexp.test(control.value)) {
        return { invalidZipCode: { msg: 'Not a valid zip-code.' } };
      }
      return null;
    };
  }

  static acceptedValues(acceptedValues: Array<any>): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (acceptedValues.indexOf(control.value) >= 0) {
        return null;
      } else {
        return { acceptedValues: { msg: 'The value is out of bound.' } };
      }
    };
  }

  static startYearThanLessEndYear(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value.start_year && control.value.end_year && control.value.start_year > control.value.end_year) {
        return {
          startYearThanLessEndYear: {
            msg: 'Start year cannot be greater than end year'
          }
        };
      }
    };
  }

  static startTimeLessThanEndTime(): ValidatorFn {
    let startTime: Date, endTime: Date;
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value.start_hour_picker && control.value.end_hour_picker) {
        startTime = new Date(
          1970,
          0,
          1,
          control.value.start_hour_picker.hour,
          control.value.start_hour_picker.minute,
          control.value.start_hour_picker.second
        );
        endTime = new Date(
          1970,
          0,
          1,
          control.value.end_hour_picker.hour,
          control.value.end_hour_picker.minute,
          control.value.end_hour_picker.second
        );
        if (endTime <= startTime) {
          return {
            startGreaterThanEndTime: {
              msg: 'Start time cannot be greater than end time'
            }
          };
        }
      }
    };
  }

  static nullValidator(): ValidatorFn {
    return (value: any): { [key: string]: any } | null => {
      return null;
    };
  }
}
