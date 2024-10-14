export type KcGridItem<T = void> = {
  // readonly col: number;
  // readonly row: number;
  // readonly cols: number;
  // readonly rows: number;
  col: number;
  row: number;
  cols: number;
  rows: number;
} & (T extends void ? object : { data: T });
