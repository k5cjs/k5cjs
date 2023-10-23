import { AbstractControl, ValidationErrors } from '@angular/forms';

const EMAIL_REGEXP =
  // eslint-disable-next-line max-len
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function isEmptyInputValue(value: unknown): boolean {
  /**
   * Check if the object is a string or array before evaluating the length attribute.
   * This avoids falsely rejecting objects that contain a custom length attribute.
   * For example, the object {id: 1, length: 0, width: 0} should not be returned as empty.
   */
  return value == null || ((typeof value === 'string' || Array.isArray(value)) && value.length === 0);
}

export function emailValidator(control: AbstractControl): ValidationErrors | null {
  if (isEmptyInputValue(control.value)) return null; // don't validate empty values to allow optional controls

  return EMAIL_REGEXP.test(String(control.value)) ? null : { email: true };
}

export class K5cValidators {
  static email(control: AbstractControl): ValidationErrors | null {
    return emailValidator(control);
  }
}
