import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';

import { KcGrid } from '../../helpers';

@Component({
  selector: 'kc-grid-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinesComponent implements OnChanges {
  @Input({ required: true }) cols!: number;
  @Input({ required: true }) rows!: number;

  @Input({ required: true }) colsGaps!: number[];
  @Input({ required: true }) rowsGaps!: number[];

  @Input() grid!: KcGrid;

  @Input() scale!: number;

  @ViewChild('grid', { static: true }) gridRef!: ElementRef<HTMLElement>;

  ngOnChanges(): void {
    this._lines();
  }

  private _lines(): void {
    this.gridRef.nativeElement.innerHTML = '';

    const girdLines = document.createElement('div');

    girdLines.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    `;

    const totalColsGaps = this.colsGaps.reduce((acc, gap) => acc + gap);
    const totalRowsGaps = this.rowsGaps.reduce((acc, gap) => acc + gap);

    let rowGap = 0;

    for (let y = 0; y < this.rows; y++) {
      let colGap = 0;

      for (let x = 0; x < this.cols; x++) {
        const cell = document.createElement('div');
        cell.innerHTML = `${x}, ${y}`;

        const xx = x / this.cols;
        const yy = y / this.rows;

        const cssText = `
          position: absolute;
          width: calc((100cqw - ${totalColsGaps}px) / ${this.cols});
          height: calc((100cqh - ${totalRowsGaps}px) / ${this.rows});
          border: 1px solid #000;
          transform: translate(calc((100cqw - ${totalColsGaps}px) * ${xx} + ${colGap}px), calc((100cqh - ${totalRowsGaps}px) * ${yy} + ${rowGap}px));
        `;

        cell.style.cssText = cssText;

        girdLines.appendChild(cell);

        colGap += this.colsGaps[x];
      }

      rowGap += this.rowsGaps[y];
    }

    this.gridRef.nativeElement.appendChild(girdLines);

    this.gridRef.nativeElement.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
    `;
  }
}
