import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent {
  name?: string;
  placeholder?: string;
  label?: string;
  type: 'text' | 'email' | 'password' = 'text';

  control: FormControl<string>;

  constructor() {
    this.name = 'username';
    this.placeholder = 'Username';
    this.label = 'Username';

    this.control = new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required.bind(Validators), Validators.email.bind(Validators)],
    });
  }

  sort(): number {
    return 0;
  }
}
