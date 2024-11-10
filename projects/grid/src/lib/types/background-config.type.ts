import { Gaps } from './gap.type';

export interface BackgroundConfig {
  scale: number;
  cols: number;
  rows: number;
  colsGaps: Gaps;
  rowsGaps: Gaps;
}
