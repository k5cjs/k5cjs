import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { KcOption } from '@k5cjs/select';

@Component({
  selector: 'app-simple-multiple-deselect-all',
  templateUrl: './simple-multiple-deselect-all.component.html',
  styleUrls: ['./simple-multiple-deselect-all.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleMultipleDeselectAllComponent {
  control: FormControl;
  options: KcOption<string, string>[];

  constructor(private _fb: FormBuilder) {
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
