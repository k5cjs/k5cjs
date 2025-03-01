import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  form = new FormGroup({
    control1: new FormControl('', { validators: Validators.required.bind(Validators), nonNullable: true }),
    control2: new FormControl('', { validators: Validators.required.bind(Validators), nonNullable: true }),
    control3: new FormControl('', { validators: Validators.required.bind(Validators), nonNullable: true }),
    control4: new FormControl('', { validators: Validators.required.bind(Validators), nonNullable: true }),
    control5: new FormControl('', { validators: Validators.required.bind(Validators), nonNullable: true }),
    control6: new FormControl('', { validators: Validators.required.bind(Validators), nonNullable: true }),
    control7: new FormControl('', { validators: Validators.required.bind(Validators), nonNullable: true }),
    control8: new FormControl('', { validators: Validators.required.bind(Validators), nonNullable: true }),
    control9: new FormControl('', { validators: Validators.required.bind(Validators), nonNullable: true }),
    control10: new FormControl('', { validators: Validators.required.bind(Validators), nonNullable: true }),
  });

  constructor() {
    this.name = 'username';
    this.placeholder = 'Username';
    this.label = 'Username';

    this.control = new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required.bind(Validators), Validators.email.bind(Validators)],
    });

    this.form = new FormGroup({
      control1: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required.bind(Validators), Validators.email.bind(Validators)],
      }),
      control2: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required.bind(Validators)],
      }),
      control3: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required.bind(Validators)],
      }),
      control4: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required.bind(Validators)],
      }),
      control5: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required.bind(Validators)],
      }),
      control6: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required.bind(Validators)],
      }),
      control7: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required.bind(Validators)],
      }),
      control8: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required.bind(Validators)],
      }),
      control9: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required.bind(Validators)],
      }),
      control10: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required.bind(Validators)],
      }),
    });
  }

  sort(): number {
    return 0;
  }
}
