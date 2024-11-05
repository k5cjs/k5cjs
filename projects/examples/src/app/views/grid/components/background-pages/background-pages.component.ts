import { Component, Input, OnChanges } from '@angular/core';

import { BackgroundConfig } from '@k5cjs/grid';

@Component({
  selector: 'app-background-pages',
  templateUrl: './background-pages.component.html',
  styleUrl: './background-pages.component.scss',
})
export class BackgroundPagesComponent implements OnChanges {
  @Input({ required: true }) pageRows!: number;
  @Input({ required: true }) config!: BackgroundConfig;

  cells: { width: string; height: string; transform: string }[] = [];
  pages: { transform: string; height: string; width: string }[] = [];

  ngOnChanges(): void {
    this._cells();
    this._pages();
  }

  private _pages(): void {
    const pagesLength = Math.ceil(this.config.rows / this.pageRows);

    const gapsHeight = this.config.rowsGaps.reduce((acc, gap) => acc + gap);

    const pages = [];

    for (let page = 0; page < pagesLength; page++) {
      const untilPageRowsGaps = this.config.rowsGaps.slice(0, page * this.pageRows).reduce((acc, gap) => acc + gap, 0);
      const pageRowsGaps = this.config.rowsGaps
        .slice(page * this.pageRows, (page + 1) * this.pageRows - 1)
        .reduce((acc, gap) => acc + gap, 0);

      pages.push({
        height: `calc((100cqh - ${gapsHeight}px) / ${this.config.rows} * ${this.pageRows} + ${pageRowsGaps + 20}px)`,
        width: `calc(100% + 20px)`,
        transform: `translate(-10px, calc((100cqh - ${gapsHeight}px) * ${(page * this.pageRows) / this.config.rows} + ${
          untilPageRowsGaps - 10
        }px))`,
      });
    }

    this.pages = pages;
  }

  private _cells(): void {
    const gapsWidth = this.config.colsGaps.reduce((acc, gap) => acc + gap);
    const gapsHeight = this.config.rowsGaps.reduce((acc, gap) => acc + gap);

    const cells = [];

    let rowGap = 0;

    for (let row = 0; row < this.config.rows; row++) {
      let colGap = 0;

      for (let col = 0; col < this.config.cols; col++) {
        const x = col / this.config.cols;
        const y = row / this.config.rows;

        cells.push({
          width: `calc((100cqw - ${gapsWidth}px) / ${this.config.cols})`,
          height: `calc((100cqh - ${gapsHeight}px) / ${this.config.rows})`,
          // eslint-disable-next-line max-len
          transform: `translate(calc((100cqw - ${gapsWidth}px) * ${x} + ${colGap}px), calc((100cqh - ${gapsHeight}px) * ${y} + ${rowGap}px))`,
        });

        colGap += this.config.colsGaps[col];
      }

      rowGap += this.config.rowsGaps[row];
    }

    this.cells = cells;
  }
}
