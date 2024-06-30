export const enum GridEvent {
  Capture = 'capture',
  Release = 'release',
  Move = 'move',
  BeforeAddRows = 'before-add-rows',
  AfterAddRows = 'after-add-rows',
}

export interface Cell {
  id: symbol;
  col: number;
  row: number;
  cols: number;
  rows: number;
  event?: GridEvent;
}
