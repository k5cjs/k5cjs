import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, inject } from '@angular/core';

import { CellEvent } from '../cell.type';
import { Grid } from '../grid';

@Component({
  selector: 'kc-lib-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent implements OnChanges {
  @Input({ required: true }) col!: number;
  @Input({ required: true }) row!: number;
  @Input({ required: true }) cols!: number;
  @Input({ required: true }) rows!: number;
  @Input({ required: true }) event!: CellEvent;

  @Input({ required: true }) colsGaps!: number[];
  @Input({ required: true }) rowsGaps!: number[];

  @Input({ required: true }) scale!: number;

  @Input() grid!: Grid;

  elementRef = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);

  private _animation: Animation | null = null;

  ngOnChanges(): void {
    if (this.event === CellEvent.Capture) {
      this.renderSkip();
    } else {
      this.render();
    }
  }

  render(): void {
    console.log('render');
    if (this.rows === 0 || this.cols === 0) return;

    const totalColsGaps = this.colsGaps.reduce((acc, gap) => acc + gap, 0);
    const totalRowsGaps = this.rowsGaps.reduce((acc, gap) => acc + gap, 0);

    const colGaps = this.colsGaps.slice(0, this.col).reduce((acc, gap) => acc + gap, 0);
    const rowGaps = this.rowsGaps.slice(0, this.row).reduce((acc, gap) => acc + gap, 0);

    const gapsInCols = this.colsGaps.slice(this.col, this.col + this.cols - 1).reduce((acc, gap) => acc + gap, 0);
    const gapsInRows = this.rowsGaps.slice(this.row, this.row + this.rows - 1).reduce((acc, gap) => acc + gap, 0);

    const xx = this.col / this.grid.cols;
    const yy = this.row / this.grid.rows;

    this._setFixedSize(this.elementRef.nativeElement);
    this._animation?.cancel();

    this._animation = this.elementRef.nativeElement.animate(
      [
        {
          transform: `translate(calc((100cqw - ${totalColsGaps}px) * ${xx} + ${colGaps}px), calc((100cqh - ${totalRowsGaps}px) * ${yy} + ${rowGaps}px))`,
          width: `calc((100cqw - ${totalColsGaps}px) / ${this.grid.cols} * ${this.cols} + ${gapsInCols}px)`,
          height: `calc((100cqh - ${totalRowsGaps}px) / ${this.grid.rows} * ${this.rows} + ${gapsInRows}px)`,
        },
      ],
      {
        duration: 3000,
        fill: 'forwards',
      },
    );

    this._animation.onfinish = () => {
      this.renderSkip();
      this._animation?.cancel();
    };
  }

  renderSkip(): void {
    console.log('renderSkip', { col: this.col, row: this.row });
    if (this.rows === 0 || this.cols === 0) return;

    const totalColsGaps = this.colsGaps.reduce((acc, gap) => acc + gap, 0);
    const totalRowsGaps = this.rowsGaps.reduce((acc, gap) => acc + gap, 0);

    const colGaps = this.colsGaps.slice(0, this.col).reduce((acc, gap) => acc + gap, 0);
    const rowGaps = this.rowsGaps.slice(0, this.row).reduce((acc, gap) => acc + gap, 0);

    const gapsInCols = this.colsGaps.slice(this.col, this.col + this.cols - 1).reduce((acc, gap) => acc + gap, 0);
    const gapsInRows = this.rowsGaps.slice(this.row, this.row + this.rows - 1).reduce((acc, gap) => acc + gap, 0);

    const xx = this.col / this.grid.cols;
    const yy = this.row / this.grid.rows;

    this._animation?.cancel();

    this.elementRef.nativeElement.style.transform = `translate(calc((100cqw - ${totalColsGaps}px) * ${xx} + ${colGaps}px), calc((100cqh - ${totalRowsGaps}px) * ${yy} + ${rowGaps}px))`;
    this.elementRef.nativeElement.style.width = `calc((100cqw - ${totalColsGaps}px) / ${this.grid.cols} * ${this.cols} + ${gapsInCols}px)`;
    this.elementRef.nativeElement.style.height = `calc((100cqh - ${totalRowsGaps}px) / ${this.grid.rows} * ${this.rows} + ${gapsInRows}px)`;
  }

  private _setFixedSize(element: HTMLElement): void {
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const style = getComputedStyle(element).transform;

    // console.log('style', style);

    const [, left] = /([-\d\.]+), [-\d\.]+\)/.exec(style)!;
    const [, top] = /([-\d\.]+)\)/.exec(style)!;

    // console.log('setFixedSize', { width, height, top, left, style: style });

    element.style.width = `${width}px`;
    element.style.height = `${height}px`;

    element.style.transform = `translate(${left}px, ${top}px)`;
  }
}
