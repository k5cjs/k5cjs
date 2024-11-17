import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Gaps, KcGridItem, KcGridItems, KcGridService } from '@k5cjs/grid';

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

  rowsGaps: Gaps = [10];
  colsGaps: Gaps = [10];

  items: KcGridItems<Data> = [
    {
      col: 0,
      row: 0,
      cols: 8,
      rows: 3,
      preventToBeSwapped: true,
      preventToBeResized: true,
      data: { id: '0', name: 'Item 0', value: 0 },
    },
    { col: 3, row: 3, cols: 3, rows: 5, data: { id: '1', name: 'Item 1', value: 1 } },
    { col: 2, row: 3, cols: 1, rows: 2, data: { id: '2', name: 'Item 2', value: 2 } },
    { col: 2, row: 12, cols: 4, rows: 3, data: { id: '3', name: 'Item 3', value: 3 } },
  ];

  data!: Data;

  changes(items: KcGridItem[]): void {
    // eslint-disable-next-line no-console
    console.log(items);
  }
}
