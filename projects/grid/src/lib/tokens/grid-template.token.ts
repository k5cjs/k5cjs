import { ElementRef, InjectionToken } from '@angular/core';
import { ItemComponent } from '../components';

export interface GridTemplate {
  containerElementRef: ElementRef<HTMLElement>;
  contentElementRef: ElementRef<HTMLElement>;
  itemsElementRef: ElementRef<HTMLElement>;
  move: (options: { x: number; y: number; width: number; height: number; item: ItemComponent }) => void;
  stop: () => void;
}

export const GRID_TEMPLATE = new InjectionToken<GridTemplate>('GRID_TEMPLATE');
