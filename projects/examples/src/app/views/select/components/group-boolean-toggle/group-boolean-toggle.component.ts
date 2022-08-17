import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { KcGroup } from '@k5cjs/select';

@Component({
  selector: 'app-group-boolean-toggle',
  templateUrl: './group-boolean-toggle.component.html',
  styleUrls: ['./group-boolean-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupBooleanToggleComponent {
  control: FormControl;
  options: KcGroup<string, boolean>;

  constructor(private _fb: FormBuilder) {
    this.control = this._fb.control({
      /**
       * same value as option
       * because need to match the value of the option
       */
      location: false,
      waiter: false,
    });

    this.options = {
      location: {
        value: [
          {
            label: 'Location',
            value: false,
          },
        ],
      },
      waiter: {
        value: [
          [
            {
              label: 'Waiter',
              value: false,
            },
          ],
        ],
      },
    };
  }
}
