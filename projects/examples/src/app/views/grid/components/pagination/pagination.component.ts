import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Gap, KcGridItems, KcGridService } from '@k5cjs/grid';

import { Data } from '../../types';

type Gaps = [number, ...number[]];

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @ViewChild(KcGridService, { static: true }) grid!: KcGridService;

  scale = new FormControl(1, { nonNullable: true });
  itemType!: Data;

  cols = 8;
  rows = 30;
  pageRows = 5;

  rowsGaps: Gaps = Array.from<Gap, Gap>({ length: this.rows }, (_, i) => this._rowGapSize(i + 1)) as Gaps;

  // colsGaps: Gaps = [10, { size: 50, preventOverlap: true } as Gap] as Gaps;
  colsGaps: Gaps = [10];

  items: KcGridItems<Data> = [
    { col: 0, row: 0, cols: 2, rows: 2, data: { id: '0', name: 'Item 1', value: 1 } },
    { col: 3, row: 1, cols: 3, rows: 4, data: { id: '1', name: 'Item 2', value: 2 } },
    { col: 2, row: 0, cols: 1, rows: 2, data: { id: '2', name: 'Item 3', value: 3 } },
    { col: 2, row: 6, cols: 4, rows: 2, data: { id: '3', name: 'Item 4', value: 4 } },
  ];

  private _rowGapSize(row: number): Gap {
    if (row % this.pageRows) return 10;

    return { size: 50, preventOverlap: true };
  }
}
