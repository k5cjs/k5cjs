import { ChangeDetectionStrategy, Component } from '@angular/core';

import { KcOption, KcOptionValue } from '@k5cjs/select';

@Component({
  selector: 'app-simple-without-form-control',
  templateUrl: './simple-without-form-control.component.html',
  styleUrls: ['./simple-without-form-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleWithoutFormControlComponent {
  options: KcOption<string, string, string>[];

  constructor() {
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

  closed(value: KcOptionValue<string>): void {
    // eslint-disable-next-line no-console
    console.log(value);
  }
}
