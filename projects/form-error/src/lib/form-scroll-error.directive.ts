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

  constructor(private _elementRef: ElementRef<HTMLElement>, private _form: FormGroupDirective) {
    const onSubmit = this._form.onSubmit.bind(this._form);

    this._form.onSubmit = (...args) => {
      const form = this._elementRef.nativeElement;

      const errorElementsNodeList = form.querySelectorAll<HTMLElement>('.ng-invalid');
      const errorElements = Array.from(errorElementsNodeList);

      const errorElement = errorElements.find((element) => element.hasAttribute('formcontrolname'));
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth' });

        if (this.focus) errorElement.focus();
      }

      return onSubmit(...args);
    };
  }
}
