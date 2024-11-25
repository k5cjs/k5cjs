import { Position, getPosition } from './get-position';

fdescribe('get position', () => {
  it('the same distance to the right and down, but the buttom has more priority', () => {
    /**
     *
     *  ┌───────┐
     *  │       │
     *  │   ┌───────┐
     *  │   │   │   │
     *  └───│───┘   │
     *      │       │
     *      └───────┘
     *
     */
    const rectangle1 = { x: 1, y: 1, width: 4, height: 4 };
    const rectangle2 = { x: 3, y: 3, width: 4, height: 4 };

    expect(getPosition(rectangle1, rectangle2)).toEqual(Position.Right);
  });

  it('the same distance to the left and top, but the left has more priority', () => {
    /**
     *
     *  ┌───────┐
     *  │       │
     *  │   ┌───│───┐
     *  │   │   │   │
     *  └───────┘   │
     *      │       │
     *      └───────┘
     *
     */
    const rectangle1 = { x: 3, y: 3, width: 4, height: 4 };
    const rectangle2 = { x: 1, y: 1, width: 4, height: 4 };

    expect(getPosition(rectangle1, rectangle2)).toEqual(Position.Left);
  });

  it('should detect right overlap', () => {
    /**
     *
     *  ┌───────┐
     *  │     ┌───────┐
     *  │     │ │     │
     *  │     │ │     │
     *  └─────│─┘     │
     *        └───────┘
     *
     */
    const rectangle1 = { x: 1, y: 1, width: 4, height: 4 };
    const rectangle2 = { x: 4, y: 2, width: 4, height: 4 };

    expect(getPosition(rectangle1, rectangle2)).toEqual(Position.Right);
  });

  it('should detect left overlap', () => {
    /**
     *
     *  ┌───────┐
     *  │     ┌─│─────┐
     *  │     │ │     │
     *  │     │ │     │
     *  └───────┘     │
     *        └───────┘
     *
     */
    const rectangle1 = { x: 4, y: 2, width: 4, height: 4 };
    const rectangle2 = { x: 1, y: 1, width: 4, height: 4 };

    expect(getPosition(rectangle1, rectangle2)).toEqual(Position.Left);
  });

  it('should detect center overlap', () => {
    /**
     *
     *  ┌───────────┐
     *  │           │
     *  │   ┌───┐   │
     *  │   │   │   │
     *  │   └───┘   │
     *  │           │
     *  └───────────┘
     *
     */
    const rectangle1 = { x: 1, y: 1, width: 6, height: 6 };
    const rectangle2 = { x: 3, y: 3, width: 2, height: 2 };

    expect(getPosition(rectangle1, rectangle2)).toEqual(Position.Center);
  });

  it('should detect center overlap big on small', () => {
    /**
     *
     *  ┌───────┐
     *  │ ┌─┐   │
     *  │ └─┘   │
     *  └───────┘
     *
     */
    const staticRectangle = { x: 2, y: 2, width: 1, height: 1 };
    const movingRectangle = { x: 1, y: 1, width: 4, height: 3 };

    expect(getPosition(staticRectangle, movingRectangle)).toEqual(Position.Center);
  });

  it('should detect overlap when one rectangle completely overlaps another', () => {
    /**
     *
     *  ┌───────────────┐
     *  │               │
     *  │   ┌───┐       │
     *  │   │   │       │
     *  │   └───┘       │
     *  │               │
     *  │               │
     *  │               │
     *  └───────────────┘
     *
     */
    const rectangle1 = { x: 1, y: 1, width: 8, height: 8 };
    const rectangle2 = { x: 3, y: 3, width: 2, height: 2 };

    expect(getPosition(rectangle1, rectangle2)).toEqual(Position.Center);
  });

  it('should detect overlap when one rectangle completely overlaps another', () => {
    /**
     *
     *  ┌───────────────┐
     *  │               │
     *  │ ┌─────┐       │
     *  │ │     │       │
     *  │ │     │       │
     *  │ └─────┘       │
     *  │               │
     *  │               │
     *  └───────────────┘
     *
     */
    const rectangle1 = { x: 1, y: 1, width: 8, height: 8 };
    const rectangle2 = { x: 2, y: 3, width: 3, height: 3 };

    expect(getPosition(rectangle1, rectangle2)).toEqual(Position.Center);
  });

  it('should detect overlap when one rectangle completely overlaps another', () => {
    /**
     *
     *  ┌───────────────────┐
     *  │                   │
     *  │ ┌───┐             │
     *  │ │   │             │
     *  │ └───┘             │
     *  │                   │
     *  │                   │
     *  │                   │
     *  │                   │
     *  │                   │
     *  └───────────────────┘
     *
     */
    const rectangle1 = { x: 1, y: 1, width: 10, height: 10 };
    const rectangle2 = { x: 2, y: 3, width: 2, height: 2 };

    expect(getPosition(rectangle1, rectangle2)).toEqual(Position.Left);
  });

  it('the same distance to the left and top, but the left has more priority', () => {
    /**
     *
     *  ┌───────┐
     *  │ ┌─────┐
     *  │ │     │
     *  │ │     │
     *  └─└─────┘
     *
     */
    const rectangle1 = { x: 2, y: 2, width: 4, height: 4 };
    const rectangle2 = { x: 1, y: 1, width: 3, height: 3 };

    expect(getPosition(rectangle1, rectangle2)).toEqual(Position.Left);
  });

  it('should detect bottom overlap', () => {
    /**
     *
     *  ┌───────┐
     *  │       │
     *  │ ┌───────┐
     *  │ │     │ │
     *  └─│─────┘ │
     *    │       │
     *    └───────┘
     *
     */
    const rectangle1 = { x: 1, y: 1, width: 4, height: 4 };
    const rectangle2 = { x: 2, y: 3, width: 4, height: 4 };

    expect(getPosition(rectangle1, rectangle2)).toEqual(Position.Bottom);
  });
});
