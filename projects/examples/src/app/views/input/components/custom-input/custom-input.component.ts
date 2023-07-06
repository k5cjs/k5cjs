import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Input } from '@angular/core';

import { WrappedFormControl, provideValueAccessor } from '@k5cjs/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  providers: [provideValueAccessor(CustomInputComponent)],
})
export class CustomInputComponent extends WrappedFormControl {
  @Input() name: string | undefined;
  @Input() placeholder: string | undefined;
  @Input() label: string | undefined;
  @Input() type: 'text' | 'email' | 'password' = 'text';

  // prettier-ignore
  @Input()
  get variant(): boolean { return this._variant; }
  // prettier-ignore
  set variant(value: boolean | string) { this._variant = coerceBooleanProperty(value); }
  private _variant: boolean;

  constructor() {
    super();

    this._variant = false;
  }
}
