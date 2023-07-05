import { ElementRef } from '@angular/core';

export interface KcControlType<T = string, E = HTMLElement> {
  value: T | null;

  get disabled(): boolean;
  disable(): void;

  get focused(): boolean;
  focus(): void;

  reset(): void;

  get errors(): Record<string, string> | null;
  /**
   * The native HTML input element associated with this control.
   */
  elementRef: ElementRef<E>;
}
