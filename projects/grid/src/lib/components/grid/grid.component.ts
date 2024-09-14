import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  forwardRef,
  inject,
} from '@angular/core';

import { GridDirective, GridItemDirective, PreviewDirective } from '../../directives';
import { KcGrid } from '../../helpers';
import { GridEvent, KcGridItems } from '../../types';
import { ItemComponent } from '../item/item.component';
import { GRID_TEMPLATE, GridTemplate, KC_GRID } from '../../tokens';

@Component({
  selector: 'kc-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: KC_GRID,
      useFactory: (component: GridComponent) => component.grid,
      deps: [forwardRef(() => GridComponent)],
    },
    {
      provide: GRID_TEMPLATE,
      useFactory: (component: GridComponent) => component,
      deps: [forwardRef(() => GridComponent)],
    },
  ],
})
export class GridComponent<T = void> implements OnInit, GridTemplate {
  @Input() scale = 1;
  @Input() cols = 0;
  @Input() rows = 0;
  @Input() autoWidth = true;
  @Input() items: KcGridItems<T> = [];

  @Input()
  set colsGaps(value: [number, ...number[]]) {
    /**
     * generate array of cols gaps
     * the size of the array is length of cols - 1
     * because we have gaps between cols
     */
    this._colsGaps = new Array(this.cols - 1).fill(0).map((_, i) => value[i] || value[0]);
  }
  get colsGaps(): number[] {
    return this._colsGaps;
  }

  private _colsGaps: number[] = [10];

  @Input()
  set rowsGaps(value: [number, ...number[]]) {
    /**
     * generate array of rows gaps
     * the size of the array is length of rows - 1
     * because we have gaps between rows
     */
    this._rowsGaps = new Array(this.rows - 1).fill(0).map((_, i) => value[i] || value[0]);
  }
  get rowsGaps(): number[] {
    return this._rowsGaps;
  }
  _rowsGaps: number[] = [10];

  @ViewChild('gridRef', { static: true }) containerElementRef!: ElementRef<HTMLElement>;
  @ViewChild('content', { static: true }) contentElementRef!: ElementRef<HTMLElement>;
  @ViewChild('items', { static: true }) itemsElementRef!: ElementRef<HTMLElement>;

  @ViewChild(GridDirective, { static: true }) gridElement!: GridDirective;
  @ViewChild(PreviewDirective, { static: true }) preview!: PreviewDirective;

  @ContentChild(GridItemDirective, { static: true }) gridItem!: GridItemDirective<T>;

  grid!: KcGrid;

  colsTotalGaps!: number;
  rowsTotalGaps!: number;

  private _requestAnimationFrameId!: number;
  private _isMoving = false;
  private _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.colsTotalGaps = this._colsTotalGaps();
    this.rowsTotalGaps = this._rowsTotalGaps();

    this.grid = new KcGrid({
      cols: this.cols,
      rows: this.rows,
      colsGaps: this.colsGaps,
      rowsGaps: this.rowsGaps,
      cellWidth: 100,
      cellHeight: 100,
      preview: this.preview.render({ col: 0, row: 0, cols: 0, rows: 0, id: Symbol('default') }),
      scrollTop: this.containerElementRef.nativeElement.scrollTop,
      scrollLeft: this.containerElementRef.nativeElement.scrollLeft,
      changeDetectorRef: this._cdr,
    });

    this.items.forEach((item, i) => {
      // const test = this.gridItem.render({ ...item, id: Symbol(`item-${i}`) });

      const chart = this.gridElement.render({
        grid: this.grid,
        ...item,
        id: Symbol(`item-${i}`),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (chart.context as any).$implicit.template = chart;

      this.grid.add({
        ...chart.context.$implicit,
        template: chart,
      });
    });

    this.scroll();

    // setTimeout(() => {
    //   this.grid.move({ ...[...this.grid._items][2][1], col: 5, row: 1 });
    //   // this.grid.move({ ...[...this.grid._items][2][1], col: 6, row: 1 });
    // }, 1000);
  }

  scroll(): void {
    this.containerElementRef.nativeElement.addEventListener('wheel', (event) => {
      if (this._isMoving) event.preventDefault();
    });

    this.containerElementRef.nativeElement.addEventListener('scroll', () => {
      if (this._isMoving) return;

      this.grid.scrollTop = this.containerElementRef.nativeElement.scrollTop;
      this.grid.scrollLeft = this.containerElementRef.nativeElement.scrollLeft;
    });
  }

  back(): void {
    this.grid.back();
  }

  stop(): void {
    cancelAnimationFrame(this._requestAnimationFrameId);
    this._isMoving = false;
  }

  move({ x, y, width, height, item }: { x: number; y: number; width: number; height: number; item: ItemComponent }) {
    /**
     * cancel previous requestAnimationFrame
     * because we want to start new one that will to current position
     */
    cancelAnimationFrame(this._requestAnimationFrameId);

    const mouseYContainer = y + height;
    const mouseXContainer = x + width;

    let increaseX = 0;
    let increaseY = 0;

    if (y < 0) {
      const percent = Math.abs(y) / (height * item.rows);

      const speed = Math.round(20 * percent);

      increaseY = -speed;
    } else if (mouseYContainer > this.containerElementRef.nativeElement.clientHeight) {
      const offset = mouseYContainer - this.containerElementRef.nativeElement.clientHeight;
      const percent = offset / (height * item.rows);

      const speed = Math.round(20 * percent);

      increaseY = speed;
    }

    if (x < 0) {
      const percent = Math.abs(x) / (width * item.cols);

      const speed = Math.round(20 * percent);

      increaseX = -speed;
    } else if (mouseXContainer > this.containerElementRef.nativeElement.clientWidth) {
      const offset = mouseXContainer - this.containerElementRef.nativeElement.clientWidth;
      const percent = offset / (width * item.cols);

      const speed = Math.round(20 * percent);

      increaseX = speed;
    }

    this._scroll(item, increaseX, increaseY);
  }

  private _scroll(item: ItemComponent, increaseX: number, increaseY: number): void {
    if (increaseX === 0 && increaseY === 0) return;

    if (this.grid.scrollLeft + increaseX <= 0) increaseX = 0;

    if (this.grid.scrollTop + increaseY <= 0) increaseY = 0;

    const scrollWidth = this.containerElementRef.nativeElement.clientWidth + this.grid.scrollLeft;
    const contentWidth = this.contentElementRef.nativeElement.offsetWidth;

    // add new column if scroll is at the right
    if (scrollWidth + increaseX > contentWidth) {
      const remainingWidth = contentWidth - scrollWidth;

      if (remainingWidth > 0) {
        increaseX = remainingWidth;
      } else {
        console.error('add new column');
        // this.grid.cols += 1;
        // this._cdr.detectChanges();
        //
        // this._scroll(item, increaseX, increaseY, increaseYPercentage, increaseXPercentage);
        return;
      }
    }

    const scrollHeight = this.containerElementRef.nativeElement.clientHeight + this.grid.scrollTop;
    const contentHeight = this.contentElementRef.nativeElement.offsetHeight;

    let temp: number | undefined;

    // add new row if scroll is at the bottom
    if (scrollHeight + increaseY > contentHeight - 500) {
      // const remainingHeight = contentHeight - scrollHeight;

      // if (remainingHeight > 0) {
      //   temp = increaseY;
      //   increaseY = remainingHeight;
      // } else {
      console.warn('add new row');

      this.grid.event.next(GridEvent.BeforeAddRows);

      this.grid.rows += 8;
      this.rows += 8;
      this.rowsGaps = [...this.rowsGaps, 0] as unknown as [number, ...number[]];
      this.rowsTotalGaps = this._rowsTotalGaps();

      this._cdr.detectChanges();

      this._scroll(item, increaseX, temp || increaseY);
      return;
      // }
    }

    this._requestAnimationFrameId = requestAnimationFrame(() => {
      this.grid.scrollLeft += increaseX;
      this.grid.scrollTop += increaseY;

      item.x += increaseX;
      item.y += increaseY;

      item.renderMove('green');

      this._isMoving = true;

      this.containerElementRef.nativeElement.scrollTo({
        left: this.grid.scrollLeft,
        top: this.grid.scrollTop,
        behavior: 'instant',
      });

      this._scroll(item, increaseX, temp || increaseY);
    });
  }

  private _colsTotalGaps(): number {
    let total = 0;

    for (let i = 0; i < this.cols; i++) {
      total += this.colsGaps[i] ?? this.colsGaps[0] ?? 0;
    }

    return total;
  }

  private _rowsTotalGaps(): number {
    let total = 0;

    for (let i = 0; i < this.rows; i++) {
      total += this.rowsGaps[i] ?? this.rowsGaps[0] ?? 0;
    }

    return total;
  }
}
