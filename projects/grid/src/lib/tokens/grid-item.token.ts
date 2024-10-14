import { ElementRef, InjectionToken } from '@angular/core';

export interface GridItemTemplate {
  elementRef: ElementRef<HTMLElement>;
  // remove this because item is rendered only if item is released
  // skip: boolean;
}

export const ITEM_COMPONENT = new InjectionToken<GridItemTemplate>('ITEM_COMPONENT');
