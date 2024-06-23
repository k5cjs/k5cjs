import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent {
  scale = new FormControl(1, { nonNullable: true });
  cols = 8;
  rows = 18;

  colsGaps: [number, ...number[]] = [30, 100, 10, 0];
  rowsGaps: [number, ...number[]] = [10, 100, 10, 0];

  items: { col: number; row: number; cols: number; rows: number }[] = [
    { col: 0, row: 0, cols: 2, rows: 2 },
    { col: 3, row: 1, cols: 3, rows: 3 },
  ];
}
