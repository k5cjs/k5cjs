import { EmbeddedViewRef } from '@angular/core';
import { KcGridItem } from './item.type';

export const enum GridEventType {
  Capture = 'capture',
  Release = 'release',
  Move = 'move',
  BeforeAddRows = 'before-add-rows',
  AfterAddRows = 'after-add-rows',
}

export interface KcGridItemContext<T = void> {
  context: KcGridItem<T>;
  config: {
    template: EmbeddedViewRef<{ $implicit: KcGridItem<T>; id: symbol }>;
    // template rendering is handled by the template itself
    handle: boolean;
  };
}
