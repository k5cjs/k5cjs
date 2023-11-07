import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  forwardRef,
  inject,
} from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Observable, Subject, switchMap, takeUntil } from 'rxjs';

import { KcControl, KcControlType } from '@k5cjs/control';

import { KC_FORM_FIELD } from './form-field.token';

@Component({
  standalone: true,
  imports: [NgIf],
  selector: 'kc-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: KC_FORM_FIELD, useExisting: forwardRef(() => KcFormField) }],
  exportAs: 'kcFormField',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class KcFormField implements OnInit, OnDestroy, KcControlType {
  @ViewChild('controlRef', { static: true }) controlRef!: ElementRef<HTMLElement>;
  @ContentChild(KcControl, { static: true }) control!: KcControl;

  elementRef: ElementRef<HTMLElement>;

  stateChanges!: Observable<void>;
  private _stateChanges!: Subject<Observable<void>>;

  protected _cdr: ChangeDetectorRef;

  private _destroyed: Subject<void>;

  constructor() {
    this.elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    this._cdr = inject(ChangeDetectorRef);

    this._destroyed = new Subject();

    this._stateChanges = new Subject();

    this.stateChanges = this._stateChanges.asObservable().pipe(
      /**
       * wait stateChanges from control
       */
      switchMap((value) => value),
    );

    this.stateChanges.pipe(takeUntil(this._destroyed)).subscribe(() => this._cdr.markForCheck());
  }

  ngOnInit(): void {
    this._stateChanges.next(this.control.stateChanges);
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

  get invalid(): boolean {
    return this.control.invalid;
  }

  get errors(): ValidationErrors | null {
    return this.control.errors;
  }

  get autofilled(): boolean {
    return this.control.autofilled;
  }

  get empty(): boolean {
    /**
     * chrome bug: autofill does not trigger onchange and input is empty but control is not empty
     * https://stackoverflow.com/questions/55244590/autofill-does-not-trigger-onchange
     */
    if (this.control.autofilled) return false;

    return this.control.empty;
  }

  @HostBinding('class')
  protected get _formField(): Record<string, boolean> {
    return {
      disabled: this.control.disabled,
      focus: this.control.focused,
      error: this.control.invalid,
      autofilled: this.control.autofilled,
    };
  }

  @HostListener('click')
  protected _click(): void {
    this.control.focus();
  }
}
