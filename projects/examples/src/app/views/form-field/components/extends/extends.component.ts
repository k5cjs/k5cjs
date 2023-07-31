import { Component } from '@angular/core';
import { FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Subject, distinctUntilChanged } from 'rxjs';

import { staggerChild, toggleY } from '@k5cjs/animations';

@Component({
  selector: 'app-extends',
  templateUrl: './extends.component.html',
  styleUrls: ['./extends.component.scss'],
  animations: [staggerChild(), toggleY()],
})
export class ExtendsComponent {
  name?: string;
  placeholder?: string;
  label?: string;
  type: 'text' | 'email' | 'password' = 'text';

  control: FormControl<string>;

  errorsChanged: Observable<ValidationErrors | null>;
  _errorsChanged: Subject<ValidationErrors | null>;

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

    this.control = new FormControl<string>('a', {
      nonNullable: true,
      validators: [
        Validators.required.bind(Validators),
        Validators.email.bind(Validators),
        Validators.minLength(5).bind(Validators),
        Validators.maxLength(10).bind(Validators),
        Validators.min(5).bind(Validators),
      ],
    });

    this._errorsChanged = new Subject();
    this.errorsChanged = this._errorsChanged
      .asObservable()
      .pipe(
        distinctUntilChanged(
          (previous, current) =>
            JSON.stringify(Object.keys(previous || {})) === JSON.stringify(Object.keys(current || {})),
        ),
      );

    this.control.statusChanges.subscribe(() => {
      this._errorsChanged.next(this.control.errors);
    });
  }

  sort(): number {
    return 0;
  }
}
