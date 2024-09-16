import { EmbeddedViewRef } from '@angular/core';
import { KcGridItem } from './item.type';

export const enum GridEvent {
  Capture = 'capture',
  Release = 'release',
  Move = 'move',
  BeforeAddRows = 'before-add-rows',
  AfterAddRows = 'after-add-rows',
}

export interface KcGridItemContext<T = void> {
  context: KcGridItem<T>;
  template: EmbeddedViewRef<{ $implicit: KcGridItem<T>; id: symbol }>;
}
