import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';

import { KcOption, filterNestedOptions } from '@k5cjs/select';

@Component({
  selector: 'app-simple-search',
  templateUrl: './simple-search.component.html',
  styleUrls: ['./simple-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleSearchComponent {
  control: UntypedFormControl;
  search: UntypedFormControl;
  options: KcOption<string, string>[];

  constructor(private _fb: UntypedFormBuilder, private _cdr: ChangeDetectorRef) {
    this.control = this._fb.control('Location 2');
    this.search = this._fb.control('');

    const options = [
      {
        label: 'Location 1',
        value: 'Location 1',
      },
      {
        label: 'Location 2',
        value: 'Location 2',
      },
    ];

    this.options = options;

    this.search.valueChanges.subscribe((keyword: string) => {
      this.options = filterNestedOptions(options, keyword);
      this._cdr.detectChanges();
    });
  }
}
