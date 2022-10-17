import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';

import { KcOption } from '@k5cjs/select';

@Component({
  selector: 'app-simple-multiple-toggle',
  templateUrl: './simple-multiple-toggle.component.html',
  styleUrls: ['./simple-multiple-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleMultipleToggleComponent {
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
}
