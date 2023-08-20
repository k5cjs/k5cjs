import { ConnectedPosition } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, NonNullableFormBuilder } from '@angular/forms';

import { KcOption } from '@k5cjs/select';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent {
  control: FormControl<string>;
  options: KcOption<string, string, string>[];

  positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 10,
    },
  ];

  constructor(private _fb: NonNullableFormBuilder) {
    this.control = this._fb.control('Location 1');

    this.options = [
      { label: 'Location 1', value: 'Location 1' },
      { label: 'Location 2', value: 'Location 2' },
    ];
  }

  mousedown(event: MouseEvent): void {
    /**
     * Prevents the blur event from firing on the root element.
     * also prevent to close the dropdown when clicking on the options.
     */
    event.preventDefault();
  }
}
