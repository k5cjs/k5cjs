import { Direction, KcGridItemContext } from '../../types';

export const getDirection = (
  previousPosition: KcGridItemContext['context'],
  currentPosition: KcGridItemContext['context'],
): Direction | null => {
  if (currentPosition.row === previousPosition.row && currentPosition.rows > previousPosition.rows)
    return Direction.South;
  if (currentPosition.row === previousPosition.row && currentPosition.rows < previousPosition.rows)
    return Direction.North;

  if (currentPosition.row < previousPosition.row) return Direction.North;
  if (currentPosition.row > previousPosition.row) return Direction.South;

  if (currentPosition.col === previousPosition.col && currentPosition.cols > previousPosition.cols)
    return Direction.East;
  if (currentPosition.col === previousPosition.col && currentPosition.cols < previousPosition.cols)
    return Direction.West;

  if (currentPosition.col < previousPosition.col) return Direction.West;
  if (currentPosition.col > previousPosition.col) return Direction.East;

  return null;
};
