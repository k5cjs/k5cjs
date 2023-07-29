import { animateChild, query, stagger, transition, trigger } from '@angular/animations';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { NgIf } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { EMPTY, Subject, merge, takeUntil } from 'rxjs';

import { staggerChild } from '@k5cjs/animations';
import { KcControl, KcControlType } from '@k5cjs/control';

import { KcError } from './directives/kc-error.directive';

// export const sgr = trigger('stagger', [
//   transition('* => *', [
//     query('@*', [style({ opacity: 0 }), stagger(1000, [animate('0.5s', style({ opacity: 1 })), animateChild()])], {
//       optional: true,
//     }),
//   ]),
// ]);

export const sgr = trigger('stagger', [
  transition('* => *', [
    query('@*', [stagger(1000, [animateChild()])], {
      optional: true,
    }),
  ]),
]);

@Component({
  standalone: true,
  imports: [NgIf],
  selector: 'kc-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [staggerChild, sgr],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class KcFormField implements AfterContentInit, OnDestroy, KcControlType {
  // prettier-ignore
  @Input()
  set showMultipleErrors(value: boolean | string) { this._showMultipleErrors = coerceBooleanProperty(value); }
  // prettier-ignore
  get showMultipleErrors(): boolean | string { return this._showMultipleErrors; }
  private _showMultipleErrors = false;

  @ViewChild('errorsContainer', { static: true, read: ViewContainerRef }) private _errorsContainer!: ViewContainerRef;

  @ContentChild(KcControl, { static: true }) control!: KcControl;
  @ContentChildren(KcError, { descendants: true }) private _errorRefs!: QueryList<KcError>;

  elementRef: ElementRef<HTMLElement>;

  protected _cdr: ChangeDetectorRef;

  private _cacheErrorRefs: Map<string, KcError>;
  private _destroyed: Subject<void>;

  constructor() {
    this.elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    this._cdr = inject(ChangeDetectorRef);

    this._cacheErrorRefs = new Map();
    this._destroyed = new Subject();
  }

  ngAfterContentInit(): void {
    // Run change detection if the value changes.
    merge(this.control.stateChanges, this.control.ngControl?.statusChanges || EMPTY)
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => {
        this._cdr.markForCheck();
        this._showErrors();
      });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get value() {
    return this.control.value;
  }

  get disabled(): boolean {
    return this.control.disabled;
  }

  disable(): void {
    this.control.disable();
  }

  get focused(): boolean {
    return this.control.focused;
  }

  focus(): void {
    this.control.focus();
  }

  reset(): void {
    this.control.reset();
  }

  get errors(): Record<string, string> | null {
    return this.control.errors;
  }
  /**
   * empty is used to now when we should show the placeholder
   */
  get empty(): boolean {
    if (Array.isArray(this.value)) return !this.value.length;

    if (typeof this.value === 'object' && this.value !== null) return !Object.keys(this.value).length;

    return !this.value;
  }

  @HostBinding('class')
  protected get _formField(): Record<string, boolean> {
    return {
      disabled: this.control.disabled,
      focus: this.control.focused,
      error: this.control.invalid,
    };
  }

  @HostListener('click')
  protected _click(): void {
    this.control.focus();
  }

  private _showErrors(): void {
    for (const error of this._errorRefs) {
      if (error.name === '*') {
        const test = Object.keys(this.errors || {}).some((key) => !this._cacheErrorRefs.has(key));

        if (test) this._showError(error, this.errors);
        else this._removeError(error);

        break;
      }

      const errorContext = this.errors?.[error.name];

      if (errorContext) this._showError(error, errorContext);
      else this._removeError(error);
    }
  }

  private _showError(error: KcError, errorContext: unknown): void {
    const parallelErrors = this.showMultipleErrors ? this._errorRefs.length : this._errorRefs.length ? 1 : 0;
    if (this._cacheErrorRefs.size >= parallelErrors) return;

    if (!this.control.invalid) return;
    if (this._cacheErrorRefs.has(error.name)) {
      const tst = this._cacheErrorRefs.get(error.name)!;
      tst.update(errorContext);

      return;
    }

    // error.render(errorContext);
    const render = error.render(errorContext);
    // this._errorsContainer.insert(render);

    this._cacheErrorRefs.set(error.name, error);
  }

  private _removeError(error: KcError): void {
    if (this._cacheErrorRefs.has(error.name)) {
      this._cacheErrorRefs.get(error.name)!.destroy();
      this._cacheErrorRefs.delete(error.name);
    }
  }
}
