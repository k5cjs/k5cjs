import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { KcGridService } from '@k5cjs/grid';

interface Data {
  scale: number;
  cols: number;
  rows: number;
  colsGaps: number[];
  rowsGaps: number[];
}

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrl: './background.component.scss',
})
export class BackgroundComponent implements OnInit, OnChanges {
  @Input({ required: true }) grid!: KcGridService;
  @Input({ required: true }) data!: Data;

  cells: { width: string; height: string; transform: string }[] = [];

  isEditing$!: Observable<boolean>;

  ngOnInit(): void {
    this.isEditing$ = this.grid.editing$;
  }

  ngOnChanges(): void {
    this._cells();
  }

  private _cells(): void {
    const gapsWidth = this.data.colsGaps.reduce((acc, gap) => acc + gap);
    const gapsHeight = this.data.rowsGaps.reduce((acc, gap) => acc + gap);

    const cells = [];

    let rowGap = 0;

    for (let row = 0; row < this.data.rows; row++) {
      let colGap = 0;

      for (let col = 0; col < this.data.cols; col++) {
        const x = col / this.data.cols;
        const y = row / this.data.rows;

        cells.push({
          width: `calc((100cqw - ${gapsWidth}px) / ${this.data.cols})`,
          height: `calc((100cqh - ${gapsHeight}px) / ${this.data.rows})`,
          // eslint-disable-next-line max-len
          transform: `translate(calc((100cqw - ${gapsWidth}px) * ${x} + ${colGap}px), calc((100cqh - ${gapsHeight}px) * ${y} + ${rowGap}px))`,
        });

        colGap += this.data.colsGaps[col];
      }

      rowGap += this.data.rowsGaps[row];
    }

    this.cells = cells;
  }
}
