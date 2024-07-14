import { getRectangleIntersection } from '../intersection.helperection.helper';

describe('intersection', () => {
  it('get overlap', () => {
    /**
     *
     * ┌───┐
     * │ ┌─┼─┐
     * └─┼─┘ │
     *   └───┘
     *
     */
    const rectangle1 = { x: 1, y: 1, width: 4, height: 4 };
    const rectangle2 = { x: 3, y: 3, width: 4, height: 4 };

    const expected = { x: 3, y: 3, width: 2, height: 2 };

    expect(getRectangleIntersection(rectangle1, rectangle2)).toEqual(expected);
  });

  it('no overlap', () => {
    /**
     *
     * ┌───┐     ┌───┐
     * │   │     │   │
     * └───┘     └───┘
     *
     */
    const rectangle1 = { x: 1, y: 1, width: 2, height: 2 };
    const rectangle2 = { x: 4, y: 4, width: 2, height: 2 };

    const expected = null;

    expect(getRectangleIntersection(rectangle1, rectangle2)).toEqual(expected);
  });

  it('one rectangle inside another', () => {
    /**
     * ┌───────┐
     * │  ┌───┐│
     * │  │   ││
     * │  └───┘│
     * └───────┘
     */
    const rectangle1 = { x: 1, y: 1, width: 6, height: 6 };
    const rectangle2 = { x: 2, y: 2, width: 2, height: 2 };

    const expected = { x: 2, y: 2, width: 2, height: 2 };

    expect(getRectangleIntersection(rectangle1, rectangle2)).toEqual(expected);
  });

  it('touching edges without overlap', () => {
    /**
     * ┌───┐
     * │   │
     * └───┘
     *     ┌───┐
     *     │   │
     *     └───┘
     */
    const rectangle1 = { x: 1, y: 1, width: 2, height: 2 };
    const rectangle2 = { x: 3, y: 1, width: 2, height: 2 };

    const expected = null;

    expect(getRectangleIntersection(rectangle1, rectangle2)).toEqual(expected);
  });

  it('complete overlap', () => {
    /**
     * ┌───┐
     * │┌─┐│
     * ││ ││
     * │└─┘│
     * └───┘
     */
    const rectangle1 = { x: 1, y: 1, width: 4, height: 4 };
    const rectangle2 = { x: 1, y: 1, width: 2, height: 2 };

    const expected = { x: 1, y: 1, width: 2, height: 2 };

    expect(getRectangleIntersection(rectangle1, rectangle2)).toEqual(expected);
  });

  it('partial edge overlap', () => {
    /**
     * ┌─────┐
     * │ ┌───┼───┐
     * │ │   │   │
     * └─┼───┘   │
     *   └───────┘
     */
    const rectangle1 = { x: 1, y: 1, width: 6, height: 4 };
    const rectangle2 = { x: 4, y: 2, width: 4, height: 4 };

    const expected = { x: 4, y: 2, width: 3, height: 3 };

    expect(getRectangleIntersection(rectangle1, rectangle2)).toEqual(expected);
  });
});
