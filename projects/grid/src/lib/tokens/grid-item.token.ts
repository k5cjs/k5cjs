import { ElementRef, InjectionToken } from '@angular/core';

export interface GridItemTemplate {
  x: number;
  y: number;
  width: number;
  height: number;
  elementRef: ElementRef<HTMLElement>;
  update({ x, y, width, height }: { x: number; y: number; width: number; height: number }): void;
  resizing(value: boolean): void;
  renderMove(color?: string): void;
  skip: boolean;
}

export const ITEM_COMPONENT = new InjectionToken<GridItemTemplate>('ITEM_COMPONENT');
