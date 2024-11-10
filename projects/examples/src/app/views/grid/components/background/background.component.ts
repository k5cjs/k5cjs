import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { BackgroundConfig, KcGridService, gapSize } from '@k5cjs/grid';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrl: './background.component.scss',
})
export class BackgroundComponent implements OnInit, OnChanges {
  @Input({ required: true }) grid!: KcGridService;
  @Input({ required: true }) config!: BackgroundConfig;

  cells: { width: string; height: string; transform: string }[] = [];

  isEditing$!: Observable<boolean>;

  ngOnInit(): void {
    this.isEditing$ = this.grid.editing$;
  }

  ngOnChanges(): void {
    this._cells();
  }

  private _cells(): void {
    const gapsWidth = this.config.colsGaps.reduce<number>((acc, gap) => acc + gapSize(gap), 0);
    const gapsHeight = this.config.rowsGaps.reduce<number>((acc, gap) => acc + gapSize(gap), 0);

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

        colGap += gapSize(this.config.colsGaps[col]);
      }

      rowGap += gapSize(this.config.rowsGaps[row]);
    }

    this.cells = cells;
  }
}
