import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { ChangeDetectorRef, ContentChildren, Directive, Inject, Input, OnDestroy, QueryList } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { KC_FORM_FIELD, KcFormField } from '@k5cjs/form-field';

import { KcError } from './form-error.directive';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[kcErrors]',
  standalone: true,
  exportAs: 'kcErrors',
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class KcErrors implements OnDestroy {
  // prettier-ignore
  @Input()
  set multiple(value: boolean | string) { this._multiple = coerceBooleanProperty(value); }
  // prettier-ignore
  get multiple(): boolean | string { return this._multiple; }
  private _multiple: boolean;

  // prettier-ignore
  @Input()
  set staggerTime(value: number | string) { this._staggerTime = coerceNumberProperty(value); }
  // prettier-ignore
  get staggerTime(): number { return this._staggerTime; }
  private _staggerTime: number;

  @ContentChildren(KcError, { descendants: true }) private _errors!: QueryList<KcError>;

  stagger: number;

  private _cache: Map<string, KcError> = new Map();
  private _destroy: Subject<void> = new Subject();

  constructor(@Inject(KC_FORM_FIELD) private _formField: KcFormField, private _cdr: ChangeDetectorRef) {
    this._multiple = false;
    this._staggerTime = 0;
    this.stagger = 0;

    this._formField.changes.pipe(takeUntil(this._destroy)).subscribe(() => this._render());
  }

  ngOnDestroy(): void {
    this._destroy.next();
  }

  private _render(): void {
    const delay = this._removeErrors() * this.staggerTime;

    if (delay)
      setTimeout(() => {
        this._addErrors();
        this._cdr.detectChanges();
      }, delay);
    else this._addErrors();
  }

  private _removeErrors(): number {
    const errors = this._formField.errors;

    let removed = 0;

    for (const error of this._errors) {
      if (this._hasError(errors, error.name)) continue;

      removed += this._removeError(error);
    }

    if (removed) this.stagger += 1;

    return removed;
  }

  private _addErrors(): number {
    const errors = this._formField.errors;

    let added = 0;

    for (const error of this._errors) {
      if (this._hasError(errors, error.name)) added = this._addError(error, errors[error.name]);
    }

    if (added) this.stagger -= 1;

    return added;
  }

  private _hasError<T extends Record<PropertyKey, unknown> | null, K extends PropertyKey>(
    errors: T,
    key: K,
  ): errors is T & { [key in K]: unknown } {
    return Object.prototype.hasOwnProperty.call(errors || {}, key);
  }

  private _addError(error: KcError, errorContext: unknown): number {
    const parallelErrors = this.multiple ? this._errors.length : this._errors.length ? 1 : 0;
    if (this._cache.size >= parallelErrors) return 0;

    if (!this._formField.control.invalid) return 0;
    if (this._cache.has(error.name)) {
      error.update(errorContext);

      return 0;
    }

    error.render(errorContext);

    this._cache.set(error.name, error);

    return 1;
  }

  private _removeError(error: KcError): number {
    if (!this._cache.has(error.name)) return 0;

    this._cache.get(error.name)!.destroy();
    this._cache.delete(error.name);

    return 1;
  }
}
