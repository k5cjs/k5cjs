import { ElementRef, InjectionToken } from '@angular/core';

export interface GridItemTemplate {
  elementRef: ElementRef<HTMLElement>;
  update({ x, y, width, height }: { x: number; y: number; width: number; height: number }): void;
  resizing(value: boolean): void;
}

export const ITEM_COMPONENT = new InjectionToken<GridItemTemplate>('ITEM_COMPONENT');
