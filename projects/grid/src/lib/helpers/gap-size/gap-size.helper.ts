import { Gap } from '../../types';

export const gapSize = (gap?: Gap): number => {
  if (!gap) return 0;

  if (typeof gap === 'number') return gap;

  return gap.size;
};
