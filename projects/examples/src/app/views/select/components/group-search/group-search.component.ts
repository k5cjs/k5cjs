import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';

import { KcOption, filterNestedOptions } from '@k5cjs/select';

@Component({
  selector: 'app-group-search',
  templateUrl: './group-search.component.html',
  styleUrls: ['./group-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupSearchComponent {
  control: UntypedFormControl;
  search: UntypedFormControl;
  options: KcOption<string, string>[][];

  constructor(private _fb: UntypedFormBuilder, private _cdr: ChangeDetectorRef) {
    this.control = this._fb.control('Location 1');
    this.search = this._fb.control('');

    const options = [
      [
        {
          label: 'Location 1',
          value: 'Location 1',
        },
        {
          label: 'Location 2',
          value: 'Location 2',
        },
      ],
      [
        {
          label: 'Location 3',
          value: 'Location 3',
        },
        {
          label: 'Location 4',
          value: 'Location 4',
        },
      ],
    ];

    this.options = options;

    this.search.valueChanges.subscribe((keyword: string) => {
      this.options = filterNestedOptions(options, keyword);
      this._cdr.detectChanges();
    });
  }
}
