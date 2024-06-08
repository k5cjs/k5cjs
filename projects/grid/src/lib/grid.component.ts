import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';

import { Grid } from './grid';
import { GridDirective } from './grid.directive';
import { ItemComponent } from './item/item.component';
import { PreviewDirective } from './preview.directive';

@Component({
  selector: 'kc-lib-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit {
  @Input() scale = 1;

  @ViewChild('gridRef', { static: true }) gridRef!: ElementRef<HTMLElement>;
  @ViewChild(GridDirective, { static: true }) gridElement!: GridDirective;
  @ViewChild(PreviewDirective, { static: true }) preview!: PreviewDirective;

  grid!: Grid;

  private _cdr = inject(ChangeDetectorRef);
  private _requestAnimationFrameId!: number;
  private _isMoving = false;

  ngOnInit(): void {
    this.grid = new Grid({
      cols: 10,
      rows: 100,
      cellWidth: 100,
      cellHeight: 100,
      preview: this.preview.render({ col: 0, row: 0, cols: 0, rows: 0 }),
      scrollTop: this.gridRef.nativeElement.scrollTop,
      scrollLeft: this.gridRef.nativeElement.scrollLeft,
    });

    const items = [
      { col: 1, row: 1, cols: 2, rows: 2 },
      { col: 3, row: 1, cols: 3, rows: 3 },
      { col: 1, row: 3, cols: 2, rows: 2 },
      { col: 3, row: 4, cols: 2, rows: 2 },
    ];

    items.forEach((item) => {
      const chart = this.gridElement.render({ grid: this.grid, ...item });
      (chart.context as any).$implicit.template = chart;

      this.grid.add({
        ...chart.context.$implicit,
        template: chart,
      });
    });

    this.scroll();
  }

  scroll(): void {
    this.gridRef.nativeElement.addEventListener('wheel', (event) => {
      if (this._isMoving) event.preventDefault();
    });

    this.gridRef.nativeElement.addEventListener('scroll', () => {
      if (this._isMoving) return;

      this.grid.scrollTop = this.gridRef.nativeElement.scrollTop;
    });
  }

  back(): void {
    this.grid.back();
  }

  stop(): void {
    cancelAnimationFrame(this._requestAnimationFrameId);
    this._isMoving = false;
  }

  move(item: ItemComponent) {
    /**
     * cancel previous requestAnimationFrame
     * because we want to start new one that will to current position
     */
    cancelAnimationFrame(this._requestAnimationFrameId);

    const test = item.y - this.gridRef.nativeElement.scrollTop;
    const mouseYContainer = item.y + item.height * item.rows - this.gridRef.nativeElement.scrollTop;

    if (test < 0) {
      const offset = Math.abs(test);
      const percent = offset / (item.height * item.rows);

      const speed = Math.round(10 * percent);

      this._scrollUp(speed, item);
    } else if (mouseYContainer > this.gridRef.nativeElement.clientHeight) {
      const offset = mouseYContainer - this.gridRef.nativeElement.clientHeight;
      const percent = offset / (item.height * item.rows);

      const speed = Math.round(10 * percent);

      this._scrollDown(speed, item);
    }
  }

  private _scrollUp(increase: number, item: ItemComponent): void {
    if (this.grid.scrollTop <= 0) return;

    this._requestAnimationFrameId = requestAnimationFrame(() => {
      this.grid.scrollTop -= increase;
      item.y -= increase;

      this._scrollY(this.grid.scrollTop);

      item.renderMove('green');

      this._scrollUp(increase, item);
    });
  }

  private _scrollDown(increase: number, item: ItemComponent) {
    const scrollHeight = this.gridRef.nativeElement.offsetHeight + this.grid.scrollTop;
    const gridHeight = this.grid.rows * this.grid.cellHeight * this.scale;

    // add new row if scroll is at the bottom
    if (scrollHeight + increase >= gridHeight) {
      this.grid.rows += 1;
      this._cdr.detectChanges();

      this._scrollDown(increase, item);
      return;
    }

    this._requestAnimationFrameId = requestAnimationFrame(() => {
      this.grid.scrollTop += increase;
      item.y += increase;

      this._scrollY(this.grid.scrollTop);

      item.renderMove('green');

      this._scrollDown(increase, item);
    });
  }

  private _scrollY(top: number): void {
    this._isMoving = true;
    this.gridRef.nativeElement.scrollTo({ top, behavior: 'instant' });
  }
}
