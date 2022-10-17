import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';

import { KcOption, KcOptionValue } from '@k5cjs/select';

@Component({
  selector: 'app-designed',
  templateUrl: './designed.component.html',
  styleUrls: ['./designed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignedComponent {
  control: UntypedFormControl;
  options: KcOption<string, string>[];

  constructor(private _fb: UntypedFormBuilder) {
    this.control = this._fb.control('Location 2');

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

  closed(value: KcOptionValue<string>) {
    // eslint-disable-next-line no-console
    console.log(value);
  }
}
