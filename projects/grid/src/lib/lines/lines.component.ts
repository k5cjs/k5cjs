import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';

import { Grid } from '../grid';

@Component({
  selector: 'kc-lib-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinesComponent implements OnChanges {
  @Input({ required: true }) cols!: number;
  @Input({ required: true }) rows!: number;
  @Input() grid!: Grid;

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
      border: 1px solid #000;
    `;

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const cell = document.createElement('div');
        cell.innerHTML = `${x}, ${y}`;

        cell.style.cssText = `
          position: absolute;
          width: ${100 / this.cols}%;
          height: ${100 / this.rows}%;
          border: 1px solid #000;
          transform: translate(${x * 100}%, ${y * 100}%);
        `;
        girdLines.appendChild(cell);
      }
    }

    this.gridRef.nativeElement.appendChild(girdLines);

    this.gridRef.nativeElement.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
    `;
  }
}
