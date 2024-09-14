import { EmbeddedViewRef, TemplateRef } from '@angular/core';
import { KcGridItem } from './item.type';

export const enum GridEvent {
  Capture = 'capture',
  Release = 'release',
  Move = 'move',
  BeforeAddRows = 'before-add-rows',
  AfterAddRows = 'after-add-rows',
}

export type Cell<T = void> = {
  id: symbol;
  event?: GridEvent;
  template?: EmbeddedViewRef<{ $implicit: Cell }> & TemplateRef<unknown>;
} & KcGridItem<T>;
