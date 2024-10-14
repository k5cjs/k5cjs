import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { KcGridItem, KcGridItems, KcGridService } from '@k5cjs/grid';

import { TEST_INJECTOR } from '../../tokens';
import { Data } from '../../types';

@Component({
  selector: 'app-simple',
  templateUrl: './simple.component.html',
  styleUrl: './simple.component.scss',
  providers: [
    {
      provide: TEST_INJECTOR,
      useValue: 'test-injector',
    },
  ],
})
export class SimpleComponent {
  @ViewChild(KcGridService, { static: true }) grid!: KcGridService;

  scale = new FormControl(1, { nonNullable: true });
  cols = 8;
  rows = 30;

  rowsGaps: [number, ...number[]] = [10];
  colsGaps: [number, ...number[]] = [10];

  items: KcGridItems<Data> = [
    { col: 0, row: 0, cols: 2, rows: 2, data: { name: 'Item 1', value: 1 } },
    { col: 3, row: 1, cols: 3, rows: 5, data: { name: 'Item 2', value: 2 } },
    { col: 2, row: 0, cols: 1, rows: 2, data: { name: 'Item 3', value: 3 } },
    { col: 2, row: 6, cols: 4, rows: 1, data: { name: 'Item 4', value: 4 } },
  ];

  data!: Data;

  delete(id: symbol): void {
    this.grid.delete(id);
  }

  changes(items: KcGridItem[]): void {
    // eslint-disable-next-line no-console
    console.log(items);
  }
}
