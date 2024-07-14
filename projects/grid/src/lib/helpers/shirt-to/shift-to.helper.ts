import { Cell } from '../../types';

export const shiftToTop = <T extends Cell>(matrix: (symbol | null)[][], item: T, shift: number): void => {
  // remove rows from bottom
  for (let y = item.row + item.rows - shift; y < item.row + item.rows; y++) {
    for (let x = item.col; x < item.col + item.cols; x++) {
      matrix[y][x] = null;
    }
  }

  // add rows to top
  for (let y = item.row - shift; y < item.row - shift + item.rows; y++) {
    for (let x = item.col; x < item.col + item.cols; x++) {
      matrix[y][x] = item.id;
    }
  }
};

export const shiftToBottom = <T extends Cell>(matrix: (symbol | null)[][], item: T, shift: number): void => {
  // remove rows from top
  for (let y = item.row; y < item.row + shift; y++) {
    for (let x = item.col; x < item.col + item.cols; x++) {
      matrix[y][x] = null;
    }
  }

  // add rows to bottom
  for (let y = item.row + shift; y < item.row + shift + item.rows; y++) {
    for (let x = item.col; x < item.col + item.cols; x++) {
      matrix[y][x] = item.id;
    }
  }
};

export const shiftToLeft = <T extends Cell>(matrix: (symbol | null)[][], item: T, shift: number): void => {
  // remove cols from right
  for (let x = item.col - shift; x < item.col + item.cols; x++) {
    for (let y = item.row; y < item.row + item.rows; y++) {
      matrix[y][x] = null;
    }
  }

  // add cols to left
  for (let x = item.col - shift; x < item.col - shift + item.cols; x++) {
    for (let y = item.row; y < item.row + item.rows; y++) {
      matrix[y][x] = item.id;
    }
  }
};

export const shiftToRight = <T extends Cell>(matrix: (symbol | null)[][], item: T, shift: number): void => {
  // remove cols from left
  for (let x = item.col; x < item.col + shift; x++) {
    for (let y = item.row; y < item.row + item.rows; y++) {
      matrix[y][x] = null;
    }
  }

  // add cols to right
  for (let x = item.col + shift; x < item.col + item.cols + shift; x++) {
    for (let y = item.row; y < item.row + item.rows; y++) {
      matrix[y][x] = item.id;
    }
  }
};
