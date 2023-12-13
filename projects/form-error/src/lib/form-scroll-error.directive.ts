import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, ElementRef, Input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[scrollToError]',
  standalone: true,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class KcScrollError {
  @Input({ transform: coerceBooleanProperty }) focus = false;

  constructor(private _elementRef: ElementRef, private _form: FormGroupDirective) {
    const onSubmit = this._form.onSubmit.bind(this._form);

    this._form.onSubmit = (...args) => {
      const form = this._elementRef.nativeElement as HTMLElement;

      if (form instanceof HTMLElement) {
        const errorElementsNodeList = form.querySelectorAll('.ng-invalid');
        const errorElements = Array.from(errorElementsNodeList) as HTMLElement[];

        const errorElement = errorElements.find((element) => element.hasAttribute('formcontrolname'));

        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'end' });

          if (this.focus) errorElement.focus();
        }
      }

      return onSubmit(...args);
    };
  }
}
