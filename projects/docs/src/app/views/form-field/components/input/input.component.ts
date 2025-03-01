import { Component, Input } from '@angular/core';

import { WrappedFormControl, provideValueAccessor } from '@k5cjs/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [provideValueAccessor(InputComponent)],
})
export class InputComponent extends WrappedFormControl {
  @Input() formControlName!: string;
}
