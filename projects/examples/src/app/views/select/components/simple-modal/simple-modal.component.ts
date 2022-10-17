import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';

import { KcOption } from '@k5cjs/select';

@Component({
  selector: 'app-simple-modal',
  templateUrl: './simple-modal.component.html',
  styleUrls: ['./simple-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleModalComponent {
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
    ];
  }
}
