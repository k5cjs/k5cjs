import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild, inject } from '@angular/core';

import { KcGridService } from '../../services';

@Component({
  selector: 'kc-grid-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinesComponent implements OnChanges {
  @Input() scale!: number;

  @ViewChild('grid', { static: true }) gridRef!: ElementRef<HTMLElement>;

  protected grid = inject(KcGridService);

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

    const totalColsGaps = this.grid.colsGaps.reduce((acc, gap) => acc + gap);
    const totalRowsGaps = this.grid.rowsGaps.reduce((acc, gap) => acc + gap);

    let rowGap = 0;

    for (let y = 0; y < this.grid.rows; y++) {
      let colGap = 0;

      for (let x = 0; x < this.grid.cols; x++) {
        const cell = document.createElement('div');
        cell.innerHTML = `${x}, ${y}`;

        const xx = x / this.grid.cols;
        const yy = y / this.grid.rows;

        const cssText = `
          position: absolute;
          width: calc((100cqw - ${totalColsGaps}px) / ${this.grid.cols});
          height: calc((100cqh - ${totalRowsGaps}px) / ${this.grid.rows});
          border: 1px solid #000;
          transform: translate(calc((100cqw - ${totalColsGaps}px) * ${xx} + ${colGap}px), calc((100cqh - ${totalRowsGaps}px) * ${yy} + ${rowGap}px));
        `;

        cell.style.cssText = cssText;

        girdLines.appendChild(cell);

        colGap += this.grid.colsGaps[x];
      }

      rowGap += this.grid.rowsGaps[y];
    }

    this.gridRef.nativeElement.appendChild(girdLines);

    this.gridRef.nativeElement.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
    `;
  }
}
