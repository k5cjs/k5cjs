import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { NgIf } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  inject,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { KcControl, KcControlType } from '@k5cjs/control';

@Component({
  selector: 'kc-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class KcFormField implements AfterContentInit, OnDestroy, KcControlType {
  @Input()
  set loading(value: string | boolean) {
    this._loading = coerceBooleanProperty(value);
  }
  get loading(): string | boolean {
    return this._loading;
  }
  private _loading = false;

  @ContentChild(KcControl, { static: true }) control!: KcControl;

  elementRef: ElementRef<HTMLElement>;

  stateChanges: Subject<void>;

  protected _changeDetectorRef: ChangeDetectorRef;
  private _destroyed: Subject<void>;

  constructor() {
    this.elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    this._changeDetectorRef = inject(ChangeDetectorRef);

    this._destroyed = new Subject();

    this.stateChanges = new Subject<void>();
  }

  ngAfterContentInit(): void {
    this.control.stateChanges.pipe(takeUntil(this._destroyed)).subscribe(() => this._changeDetectorRef.markForCheck());

    // Run change detection if the value changes.
    if (this.control.ngControl && this.control.ngControl.valueChanges) {
      this.control.ngControl.valueChanges
        .pipe(takeUntil(this._destroyed))
        .subscribe(() => this._changeDetectorRef.markForCheck());
    }
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

  @HostBinding('class')
  get _formField(): Record<string, boolean> {
    return {
      disabled: this.control.disabled,
      focus: this.control.focused,
      error: this.control.invalid,
    };
  }

  get empty(): boolean {
    if (Array.isArray(this.value)) return !this.value.length;

    if (typeof this.value === 'object' && this.value !== null) return !Object.keys(this.value).length;

    return !this.value;
  }
}
