import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { KcGroup } from 'dist/select/public-api';

@Component({
  selector: 'app-group-boolean',
  templateUrl: './group-boolean.component.html',
  styleUrls: ['./group-boolean.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupBooleanComponent {
  control: FormControl;
  options: KcGroup<string, boolean>;

  constructor(private _fb: FormBuilder) {
    this.control = this._fb.control({});

    this.options = {
      location: {
        value: [
          {
            label: 'Location',
            value: true,
          },
        ],
      },
      waiter: {
        value: [
          [
            {
              label: 'Waiter',
              value: true,
            },
          ],
        ],
      },
    };
  }
}
