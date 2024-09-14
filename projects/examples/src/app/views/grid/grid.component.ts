import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { KcGridItems, KcGridService } from '@k5cjs/grid';

interface Data {
  name: string;
  value: number;
}

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent {
  @ViewChild(KcGridService) grid!: KcGridService;

  scale = new FormControl(1, { nonNullable: true });
  cols = 8;
  rows = 30;

  colsGaps: [number, ...number[]] = [30, 100, 100, 0];
  rowsGaps: [number, ...number[]] = [10, 100, 10, 0, 100];

  items: KcGridItems<Data> = [
    { col: 0, row: 0, cols: 2, rows: 2, data: { name: 'Item 1', value: 1 } },
    { col: 3, row: 1, cols: 3, rows: 5, data: { name: 'Item 2', value: 2 } },
    { col: 2, row: 0, cols: 1, rows: 2, data: { name: 'Item 3', value: 3 } },
    { col: 2, row: 6, cols: 4, rows: 1, data: { name: 'Item 4', value: 4 } },
  ];

  data!: Data;

  back(): void {
    this.grid.back();
  }
}
