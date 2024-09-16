// import { shiftToBottom, shiftToLeft, shiftToRight, shiftToTop } from './shift-to.helper';
//
// describe('shift to', () => {
//   it('shift with two position to bottom', () => {
//     /**
//      *  ┌───────┐
//      *  └───────┘
//      *
//      *  ┌───────┐
//      *  └───────┘
//      */
//     const id = Symbol('id');
//
//     const matrix = [
//       [null, null, null, null, null],
//       [null, null, null, null, null],
//       [null, null, id, id, null],
//       [null, null, null, null, null],
//       [null, null, null, null, null],
//     ];
//
//     const expected = [
//       [null, null, null, null, null],
//       [null, null, null, null, null],
//       [null, null, null, null, null],
//       [null, null, null, null, null],
//       [null, null, id, id, null],
//     ];
//
//     shiftToBottom(matrix, { id, col: 2, row: 2, cols: 2, rows: 1 }, 2);
//
//     expect(matrix).toEqual(expected);
//   });
//
//   it('shift with two position to top', () => {
//     /**
//      *  ┌───────┐
//      *  └───────┘
//      *
//      *  ┌───────┐
//      *  └───────┘
//      */
//     const id = Symbol('id');
//
//     const matrix = [
//       [null, null, null, null, null],
//       [null, null, null, null, null],
//       [null, null, id, id, null],
//       [null, null, null, null, null],
//       [null, null, null, null, null],
//     ];
//
//     const expected = [
//       [null, null, id, id, null],
//       [null, null, null, null, null],
//       [null, null, null, null, null],
//       [null, null, null, null, null],
//       [null, null, null, null, null],
//     ];
//
//     shiftToTop(matrix, { id, col: 2, row: 2, cols: 2, rows: 1 }, 2);
//
//     expect(matrix).toEqual(expected);
//   });
//
//   it('shift with two position to left', () => {
//     /**
//      *  ┌───────┐
//      *  └───────┘
//      *
//      *  ┌───────┐
//      *  └───────┘
//      */
//     const id = Symbol('id');
//
//     const matrix = [
//       [null, null, null, null, null],
//       [null, null, id, null, null],
//       [null, null, id, null, null],
//       [null, null, null, null, null],
//     ];
//
//     const expected = [
//       [null, null, null, null, null],
//       [id, null, null, null, null],
//       [id, null, null, null, null],
//       [null, null, null, null, null],
//     ];
//
//     shiftToLeft(matrix, { id, col: 2, row: 1, cols: 1, rows: 2 }, 2);
//
//     expect(matrix).toEqual(expected);
//   });
//
//   it('shift with two position to right', () => {
//     /**
//      *  ┌───────┐
//      *  └───────┘
//      *
//      *  ┌───────┐
//      *  └───────┘
//      */
//     const id = Symbol('id');
//
//     const matrix = [
//       [null, null, null, null, null],
//       [null, null, id, null, null],
//       [null, null, id, null, null],
//       [null, null, null, null, null],
//     ];
//
//     const expected = [
//       [null, null, null, null, null],
//       [null, null, null, null, id],
//       [null, null, null, null, id],
//       [null, null, null, null, null],
//     ];
//
//     shiftToRight(matrix, { id, col: 2, row: 1, cols: 1, rows: 2 }, 2);
//
//     expect(matrix).toEqual(expected);
//   });
// });
