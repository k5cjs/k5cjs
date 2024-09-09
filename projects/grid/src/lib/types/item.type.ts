export type KcGridItem<T = void> = {
  col: number;
  row: number;
  cols: number;
  rows: number;
} & (T extends void ? object : { data: T });
