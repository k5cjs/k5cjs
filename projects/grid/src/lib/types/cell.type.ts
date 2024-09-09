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
} & KcGridItem<T>;
