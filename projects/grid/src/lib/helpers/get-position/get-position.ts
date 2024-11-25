declare global {
  interface Window {
    render(...number: { x: number; y: number }[]): void;
  }
}

type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Point = {
  x: number;
  y: number;
};

export enum Position {
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Left = 'left',
  Center = 'center',
}
const euclideanDistance = (point1: Point, point2: Point) => {
  const deltaX = point2.x - point1.x;
  const deltaY = point2.y - point1.y;

  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
};

/**
 * this function will return the direction of overlap between two rectangles
 *
 * @returns 'top' | 'right' | 'bottom' | 'left' | 'center'
 *
 */
export const getPosition = (
  staticRectangle: Rectangle,
  movingRectangle: Rectangle & { colRest?: number; rowRest?: number },
): Position => {
  const movingCenter = {
    x: movingRectangle.x + (movingRectangle.colRest || 0) + movingRectangle.width / 2,
    y: movingRectangle.y + (movingRectangle.rowRest || 0) + movingRectangle.height / 2,
  };

  const staticTop = { x: staticRectangle.x + staticRectangle.width / 2, y: staticRectangle.y };
  const staticRight = {
    x: staticRectangle.x + staticRectangle.width,
    y: staticRectangle.y + staticRectangle.height / 2,
  };
  const staticBottom = {
    x: staticRectangle.x + staticRectangle.width / 2,
    y: staticRectangle.y + staticRectangle.height,
  };
  const staticLeft = { x: staticRectangle.x, y: staticRectangle.y + staticRectangle.height / 2 };
  const staticCenter = {
    x: staticRectangle.x + staticRectangle.width / 2,
    y: staticRectangle.y + staticRectangle.height / 2,
  };

  /**
   * distance to each side of the static rectangle
   *
   *  ┌─────T─────┐
   *  │           │
   *  │           │
   *  L     C     R
   *  │           │
   *  │           │
   *  └─────B─────┘
   *
   *  and put in priority order
   *  1. Right
   *  2. Left
   *  3. Bottom
   *  4. Top
   *  5. Center
   */
  const directions = [
    {
      direction: Position.Right,
      distance: euclideanDistance(movingCenter, staticRight),
    },
    {
      direction: Position.Left,
      distance: euclideanDistance(movingCenter, staticLeft),
    },
    {
      direction: Position.Bottom,
      distance: euclideanDistance(movingCenter, staticBottom),
    },
    {
      direction: Position.Top,
      distance: euclideanDistance(movingCenter, staticTop),
    },
    {
      direction: Position.Center,
      distance: euclideanDistance(movingCenter, staticCenter),
    },
  ];

  if (window.render) window.render(movingCenter, staticTop, staticRight, staticBottom, staticLeft, staticCenter);

  const direction = directions.reduce((prev, current) =>
    prev.distance <= current.distance ? prev : current,
  ).direction;

  return direction;
};
