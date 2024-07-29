import { Cell, Direction } from '../../types';

export const shrink = (over: Cell, item: Cell, direction: Direction): boolean => {
  /**
   *  ┌───────┐
   *  │       │
   *  │       │
   *  │       │
   *  └───────┘
   *  ┌───────┐
   *  │       │
   *  │       │
   *  │       │
   *  └───────┘
   *
   *  ┌───────┐
   *  │       │
   *  │       │
   *  ┌───────┐
   *  └───────┘
   *  │       │
   *  │       │
   *  │       │
   *  │       │
   *  └───────┘
   */
  if (direction === Direction.North) {
    if (over.row >= item.row) return false;

    over.rows = item.row - over.row;

    return true;
  }

  if (direction === Direction.South) {
    if (over.row + over.rows <= item.row + item.rows) return false;

    const tmp = over.row;

    over.row = item.row + item.rows;
    over.rows = over.rows - (over.row - tmp);

    return true;
  }

  if (direction === Direction.East) {
    if (over.col + over.cols <= item.col + item.cols) return false;

    const tmp = over.col;

    over.col = item.col + item.cols;
    over.cols = over.cols - (over.col - tmp);

    return true;
  }

  if (direction === Direction.West) {
    if (over.col >= item.col) return false;

    over.cols = item.col - over.col;

    return true;
  }

  return false;
};
