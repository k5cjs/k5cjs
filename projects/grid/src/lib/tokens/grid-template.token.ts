import { ElementRef, InjectionToken } from '@angular/core';

export interface GridTemplate {
  containerElementRef: ElementRef<HTMLElement>;
  contentElementRef: ElementRef<HTMLElement>;
  itemsElementRef: ElementRef<HTMLElement>;
}

export const GRID_TEMPLATE = new InjectionToken<GridTemplate>('GRID_TEMPLATE');
