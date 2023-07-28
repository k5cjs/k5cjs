import { animateChild, query, stagger, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { map, timer } from 'rxjs';

import { blockInitialRender, ngIf, staggerChild, toggleY } from '@k5cjs/animations';

export const sgr = trigger('stagger', [
  transition('* => *', [
    query('@*', [stagger(1000, [animateChild()])], {
      optional: true,
    }),
  ]),
]);

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [toggleY, staggerChild, blockInitialRender, ngIf, sgr],
})
export class FormFieldComponent {
  name?: string;
  placeholder?: string;
  label?: string;
  type: 'text' | 'email' | 'password' = 'text';

  control: FormControl<string>;

  items = [1, 2, 3, 4];

  delay = timer(5000).pipe(
    //
    map(() => ['a', 'b', 'c', 'd']),
  );

  errors: Record<string, string | ((params: { requiredLength: number; actualLength: number }) => string)> = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    min: 'Please enter a valid email address',
    minlength: ({ requiredLength, actualLength }: { requiredLength: number; actualLength: number }) =>
      `Please enter at least ${requiredLength} characters, you have entered ${actualLength} characters`,
    '*': 'Default error message',
  };

  constructor() {
    this.name = 'username';
    this.placeholder = 'Username';
    this.label = 'Username';

    this.control = new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required.bind(Validators),
        Validators.email.bind(Validators),
        Validators.minLength(5).bind(Validators),
        Validators.maxLength(10).bind(Validators),
        Validators.min(5).bind(Validators),
      ],
    });
  }

  sort(): number {
    return 0;
  }
}
