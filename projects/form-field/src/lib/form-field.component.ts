import { NgIf } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  inject,
} from '@angular/core';
import { EMPTY, Subject, merge, takeUntil } from 'rxjs';

import { KcControl, KcControlType } from '@k5cjs/control';

@Component({
  standalone: true,
  imports: [NgIf],
  selector: 'kc-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class KcFormField implements AfterContentInit, OnDestroy, KcControlType {
  @ContentChild(KcControl, { static: true }) control!: KcControl;

  elementRef: ElementRef<HTMLElement>;

  protected _cdr: ChangeDetectorRef;
  private _destroyed: Subject<void>;

  constructor() {
    this.elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    this._cdr = inject(ChangeDetectorRef);

    this._destroyed = new Subject();
  }

  ngAfterContentInit(): void {
    // Run change detection if the value changes.
    merge(this.control.stateChanges, this.control.ngControl?.statusChanges || EMPTY)
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => this._cdr.markForCheck());
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
}
