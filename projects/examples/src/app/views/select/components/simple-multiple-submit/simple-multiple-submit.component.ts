import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';

import { KcOption, KcOptionValue } from '@k5cjs/select';

@Component({
  selector: 'app-simple-multiple-submit',
  templateUrl: './simple-multiple-submit.component.html',
  styleUrls: ['./simple-multiple-submit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleMultipleSubmitComponent {
  control: UntypedFormControl;
  options: KcOption<string, string>[];

  constructor(private _fb: UntypedFormBuilder) {
    this.control = this._fb.control(['Location 2']);

    this.options = [
      {
        label: 'Location 1',
        value: 'Location 1',
      },
      {
        label: 'Location 2',
        value: 'Location 2',
      },
      {
        label: 'Location 3',
        value: 'Location 3',
      },
      {
        label: 'Location 4',
        value: 'Location 4',
      },
    ];
  }

  closed(options: KcOptionValue<string>): void {
    // eslint-disable-next-line no-console
    console.log(options);
  }
}
