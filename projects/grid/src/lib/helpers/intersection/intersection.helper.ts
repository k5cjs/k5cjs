type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const getRectangleIntersection = (rect1: Rectangle, rect2: Rectangle): Rectangle | null => {
  const x = Math.max(rect1.x, rect2.x);
  const y = Math.max(rect1.y, rect2.y);

  const width = Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - x;
  const height = Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - y;

  return width > 0 && height > 0 ? { x, y, width, height } : null;
};
