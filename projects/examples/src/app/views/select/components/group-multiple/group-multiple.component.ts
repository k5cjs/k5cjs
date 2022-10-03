import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { KcGroup } from '@k5cjs/select';

@Component({
  selector: 'app-group-multiple',
  templateUrl: './group-multiple.component.html',
  styleUrls: ['./group-multiple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupMultipleComponent {
  control: FormControl;
  options: KcGroup<string, string>;

  constructor(private _fb: FormBuilder) {
    this.control = this._fb.control({});

    this.options = {
      locations: {
        label: 'Locations',
        value: [
          {
            key: 'location 1',
            label: 'Location 1',
            value: 'Location 1',
          },
          {
            key: 'location 2',
            label: 'Location 2',
            value: 'Location 2',
          },
        ],
      },
      users: {
        label: 'Users',
        value: [
          [
            {
              key: 'waiter 1',
              label: 'Waiter 1',
              value: 'Waiter 1',
            },
            {
              key: 'waiter 2',
              label: 'Waiter 2',
              value: 'Waiter 2',
            },
          ],
        ],
      },
    };
  }
}
