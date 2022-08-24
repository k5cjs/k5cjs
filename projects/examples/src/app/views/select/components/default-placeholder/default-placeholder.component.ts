import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { KcOption } from 'dist/select/public-api';

@Component({
  selector: 'app-default-placeholder',
  template: `
    <pre>{{ control.value | json }}</pre>

    <kc-select [formControl]="control" [options]="options" multiple>
      <kc-value *kcValue>Value</kc-value>

      <kc-options *kcOptions="let options" [options]="options">
        <kc-option *kcOption="let option" [option]="option"></kc-option>
      </kc-options>
    </kc-select>
`,
  styleUrls: [],
})
export class DefaultPlaceHolderComponent {
  control: FormControl;
  options: KcOption<string, string>[];

  constructor(private _fb: FormBuilder) {
    this.control = this._fb.control(null);

    this.options = [
      {
        label: 'Location 1',
        value: 'Location 1',
      },
      {
        label: 'Location 2',
        value: 'Location 2',
      },
    ];
  }
}
