import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';

import { KcGroup } from 'dist/select/public-api';

@Component({
  selector: 'app-group-boolean',
  templateUrl: './group-boolean.component.html',
  styleUrls: ['./group-boolean.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupBooleanComponent {
  control: UntypedFormControl;
  options: KcGroup<string, boolean>;

  constructor(private _fb: UntypedFormBuilder) {
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
