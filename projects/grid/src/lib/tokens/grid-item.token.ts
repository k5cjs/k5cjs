import { ElementRef, InjectionToken } from '@angular/core';

export interface GridItemTemplate {
  elementRef: ElementRef<HTMLElement>;
  skip: boolean;
}

export const ITEM_COMPONENT = new InjectionToken<GridItemTemplate>('ITEM_COMPONENT');
