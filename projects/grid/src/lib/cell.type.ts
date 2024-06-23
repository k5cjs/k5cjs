export const enum CellEvent {
  Capture = 'capture',
  Move = 'move',
  Release = 'release',
}

export interface Cell {
  id: symbol;
  col: number;
  row: number;
  cols: number;
  rows: number;
  event?: CellEvent;
}
