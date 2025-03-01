import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { KcOption } from '@k5cjs/select';

@Component({
  selector: 'app-select-simple',
  templateUrl: './select-simple.component.html',
  styleUrls: ['./select-simple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSimpleComponent {
  control = new FormControl();

  options: Observable<KcOption<string, string, string>[]> = of([
    {
      label: 'Location 1',
      value: 'Location 1',
    },
    {
      label: 'Location 2',
      value: 'Location 2',
    },
  ]);
}
