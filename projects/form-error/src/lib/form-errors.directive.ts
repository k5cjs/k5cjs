import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChildren,
  DestroyRef,
  Directive,
  Input,
  QueryList,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { KC_FORM_FIELD } from '@k5cjs/form-field';

import { KcError } from './form-error.directive';

@Directive({
  selector: '[kcErrors]',
  standalone: true,
  exportAs: 'kcErrors',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class KcErrors implements AfterContentInit {
  // prettier-ignore
  @Input()
  set multiple(value: boolean | string) { this._multiple = coerceBooleanProperty(value); }
  // prettier-ignore
  get multiple(): boolean | string { return this._multiple; }
  private _multiple = false;

  // prettier-ignore
  @Input()
  set staggerTime(value: number | string) { this._staggerTime = coerceNumberProperty(value); }
  // prettier-ignore
  get staggerTime(): number { return this._staggerTime; }
  private _staggerTime = 0;

  @ContentChildren(KcError, { descendants: true }) private _errors!: QueryList<KcError>;

  stagger = 0;

  private _cache: Map<string, KcError> = new Map();

  private _formField = inject(KC_FORM_FIELD);
  protected _cdr = inject(ChangeDetectorRef);
  protected _destroy = inject(DestroyRef);

  constructor() {
    this._formField.stateChanges
      .pipe(takeUntilDestroyed(this._destroy))
      .subscribe(() => this._errors && this._render());
  }

  ngAfterContentInit(): void {
    this._render();
  }

  private _render(): void {
    const delay = this._removeErrors() * this.staggerTime;

    if (delay) setTimeout(() => this._addErrors(), delay);
    else this._addErrors();
  }

  private _removeErrors(): number {
    let removed = 0;

    for (const error of this._errors) removed += this._removeError(error);

    if (removed) {
      this.stagger += 1;
      this._cdr.detectChanges();
    }

    return removed;
  }

  private _addErrors(): number {
    const errors = this._formField.errors;

    let added = 0;

    for (const error of this._errors)
      if (this._hasError(errors, error.name)) added = this._addError(error, errors[error.name]);

    if (added) {
      this.stagger -= 1;
      this._cdr.detectChanges();
    }

    return added;
  }

  private _hasError<T extends Record<PropertyKey, unknown> | null, K extends PropertyKey>(
    errors: T,
    key: K,
  ): errors is T & { [key in K]: unknown } {
    return Object.prototype.hasOwnProperty.call(errors || {}, key);
  }

  private _addError(error: KcError, errorContext: unknown): number {
    const parallelErrors = this.multiple ? this._errors.length : 1;
    /**
     * skip to add new error if multiple is false
     */
    if (this._cache.size >= parallelErrors) return 0;

    if (!this._formField.invalid) return 0;

    if (this._cache.has(error.name)) {
      error.update(errorContext);

      return 0;
    }

    error.render(errorContext);
    this._cache.set(error.name, error);

    return 1;
  }

  private _removeError(error: KcError): number {
    /**
     * skip if error was not rendered
     */
    if (!this._cache.has(error.name)) return 0;

    const errors = this._formField.errors;
    /**
     * if error exist but control is valid, remove the error
     */
    if (this._hasError(errors, error.name) && this._formField.invalid) return 0;

    this._cache.get(error.name)!.destroy();
    this._cache.delete(error.name);

    return 1;
  }
}
