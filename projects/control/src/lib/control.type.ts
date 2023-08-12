import { ElementRef } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';

export interface KcControlType<T = string, E = HTMLElement> {
  value: T | null;

  get autofilled(): boolean;

  get invalid(): boolean;

  get disabled(): boolean;
  disable(): void;

  get focused(): boolean;
  focus(): void;

  get empty(): boolean;

  reset(): void;

  get errors(): ValidationErrors | null;
  /**
   * The native HTML input element associated with this control.
   */
  elementRef: ElementRef<E>;

  stateChanges: Observable<void>;
}
