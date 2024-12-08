import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnDestroy, inject } from '@angular/core';

import { GridEventType, KcGridItem } from '../../types';
import { KcGridService } from '../../services';
import { gapSize } from '../../helpers';

@Component({
  selector: 'kc-grid-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) item!: KcGridItem;
  @Input({ required: true }) event!: GridEventType;
  @Input({ required: true }) scale!: number;

  elementRef = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);

  private _isAnimating = false;

  private _transitionstart = () => (this._isAnimating = true);
  private _transitionend = () => (this._isAnimating = false);

  protected _grid = inject(KcGridService);

  constructor() {
    this.elementRef.nativeElement.addEventListener('transitionstart', this._transitionstart, false);
    this.elementRef.nativeElement.addEventListener('transitionend', this._transitionend, false);
  }

  ngOnChanges(): void {
    if (this.event === GridEventType.Capture) {
      this._updateStyle();
      requestAnimationFrame(() => this._addAnimation());
    } else if (this.event === GridEventType.Release) {
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
    if (this.item.rows === 0 || this.item.cols === 0) return;

    this.elementRef.nativeElement.style.width = this._widthValue();
    this.elementRef.nativeElement.style.height = this._heightValue();
    this.elementRef.nativeElement.style.transform = this._transformValue();
  }

  private _transformValue(): string {
    const colGaps = this._grid.colsGaps.slice(0, this.item.col).reduce<number>((acc, gap) => acc + gapSize(gap), 0);
    const rowGaps = this._grid.rowsGaps.slice(0, this.item.row).reduce<number>((acc, gap) => acc + gapSize(gap), 0);

    const xx = this.item.col / this._grid.cols;
    const yy = this.item.row / this._grid.rows;

    return `translate3d(calc((100cqw - ${this._grid.colsTotalGaps}px) * ${xx} + ${colGaps}px), calc((100cqh - ${this._grid.rowsTotalGaps}px) * ${yy} + ${rowGaps}px), 0)`;
  }

  private _widthValue(): string {
    const gapsInCols = this._grid.colsGaps
      .slice(this.item.col, this.item.col + this.item.cols - 1)
      .reduce<number>((acc, gap) => acc + gapSize(gap), 0);

    return `calc((100cqw - ${this._grid.colsTotalGaps}px) / ${this._grid.cols} * ${this.item.cols} + ${gapsInCols}px)`;
  }

  private _heightValue(): string {
    const gapsInRows = this._grid.rowsGaps
      .slice(this.item.row, this.item.row + this.item.rows - 1)
      .reduce<number>((acc, gap) => acc + gapSize(gap), 0);

    return `calc((100cqh - ${this._grid.rowsTotalGaps}px) / ${this._grid.rows} * ${this.item.rows} + ${gapsInRows}px)`;
  }
}
