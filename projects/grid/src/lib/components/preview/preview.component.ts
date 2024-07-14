import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnDestroy, inject } from '@angular/core';

import { Grid } from '../../helpers';
import { GridEvent } from '../../types';

@Component({
  selector: 'kc-lib-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) col!: number;
  @Input({ required: true }) row!: number;
  @Input({ required: true }) cols!: number;
  @Input({ required: true }) rows!: number;
  @Input({ required: true }) event!: GridEvent;

  @Input({ required: true }) colsGaps!: number[];
  @Input({ required: true }) rowsGaps!: number[];

  @Input({ required: true }) scale!: number;

  @Input({ required: true }) gridRef!: HTMLElement;

  @Input() grid!: Grid;

  elementRef = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);

  private _isAnimating = false;

  private _transitionstart = () => (this._isAnimating = true);
  private _transitionend = () => (this._isAnimating = false);

  constructor() {
    this.elementRef.nativeElement.addEventListener('transitionstart', this._transitionstart, false);
    this.elementRef.nativeElement.addEventListener('transitionend', this._transitionend, false);
  }

  ngOnChanges(): void {
    if (this.event === GridEvent.Capture) {
      this._updateStyle();
      requestAnimationFrame(() => this._addAnimation());
    } else if (this.event === GridEvent.Release) {
      if (this._isAnimating) this._removeAnimationAfterFinished();
      else this._removeAnimation();
    } else {
      this._updateStyle();
    }
  }

  ngOnDestroy(): void {
    this.elementRef.nativeElement.removeEventListener('transitionstart', this._transitionstart, false);
    this.elementRef.nativeElement.removeEventListener('transitionend', this._transitionend, false);
  }

  private _addAnimation(): void {
    this.elementRef.nativeElement.style.transition = '300ms';
    this.elementRef.nativeElement.style.transitionTimingFunction = 'ease';
  }

  private _removeAnimation(): void {
    this.elementRef.nativeElement.style.transition = '';
  }

  private _removeAnimationAfterFinished(): void {
    this.elementRef.nativeElement.addEventListener('transitionend', this._removeAnimation.bind(this), {
      capture: false,
      once: true,
    });
  }

  private _updateStyle(): void {
    if (this.rows === 0 || this.cols === 0) return;

    this.elementRef.nativeElement.style.width = this._widthValue();
    this.elementRef.nativeElement.style.height = this._heightValue();
    this.elementRef.nativeElement.style.transform = this._transformValue();
  }

  private _transformValue(): string {
    const totalColsGaps = this.colsGaps.reduce((acc, gap) => acc + gap, 0);
    const totalRowsGaps = this.rowsGaps.reduce((acc, gap) => acc + gap, 0);

    const colGaps = this.colsGaps.slice(0, this.col).reduce((acc, gap) => acc + gap, 0);
    const rowGaps = this.rowsGaps.slice(0, this.row).reduce((acc, gap) => acc + gap, 0);

    const xx = this.col / this.grid.cols;
    const yy = this.row / this.grid.rows;

    return `translate3d(calc((100cqw - ${totalColsGaps}px) * ${xx} + ${colGaps}px), calc((100cqh - ${totalRowsGaps}px) * ${yy} + ${rowGaps}px), 0)`;
  }

  private _widthValue(): string {
    const totalColsGaps = this.colsGaps.reduce((acc, gap) => acc + gap, 0);
    const gapsInCols = this.colsGaps.slice(this.col, this.col + this.cols - 1).reduce((acc, gap) => acc + gap, 0);

    return `calc((100cqw - ${totalColsGaps}px) / ${this.grid.cols} * ${this.cols} + ${gapsInCols}px)`;
  }

  private _heightValue(): string {
    const totalRowsGaps = this.rowsGaps.reduce((acc, gap) => acc + gap, 0);
    const gapsInRows = this.rowsGaps.slice(this.row, this.row + this.rows - 1).reduce((acc, gap) => acc + gap, 0);

    return `calc((100cqh - ${totalRowsGaps}px) / ${this.grid.rows} * ${this.rows} + ${gapsInRows}px)`;
  }
}
