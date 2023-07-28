import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { map, timer } from 'rxjs';

import { toggleY } from '@k5cjs/animations';

@Component({
  selector: 'app-extends',
  templateUrl: './extends.component.html',
  styleUrls: ['./extends.component.scss'],
  animations: [toggleY],
})
export class ExtendsComponent {
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
