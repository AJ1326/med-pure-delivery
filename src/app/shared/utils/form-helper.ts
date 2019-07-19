import { FormArray, FormGroup } from '@angular/forms';
import { mapValues } from 'lodash';
export class FormHelper {
  public static markAllAsDirty(formGroup: FormGroup | FormArray): void {
    mapValues(formGroup.controls, c => {
      if (c instanceof FormGroup || c instanceof FormArray) {
        FormHelper.markAllAsDirty(c);
      } else {
        c.markAsDirty();
      }
    });
  }
}
