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
      cols: 100,
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
      this.grid.scrollLeft = this.gridRef.nativeElement.scrollLeft;
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

    let increaseX = 0;
    let increaseY = 0;

    if (test < 0) {
      const offset = Math.abs(test);
      const percent = offset / (item.height * item.rows);

      const speed = Math.round(10 * percent);

      increaseY = -speed;
    } else if (mouseYContainer > this.gridRef.nativeElement.clientHeight) {
      const offset = mouseYContainer - this.gridRef.nativeElement.clientHeight;
      const percent = offset / (item.height * item.rows);

      const speed = Math.round(10 * percent);

      increaseY = speed;
    }

    const testX = item.x - this.gridRef.nativeElement.scrollLeft;
    const mouseXContainer = item.x + item.width * item.cols - this.gridRef.nativeElement.scrollLeft;

    if (testX < 0) {
      const offset = Math.abs(testX);
      const percent = offset / (item.width * item.cols);

      const speed = Math.round(10 * percent);

      increaseX = -speed;
    } else if (mouseXContainer > this.gridRef.nativeElement.clientWidth) {
      const offset = mouseXContainer - this.gridRef.nativeElement.clientWidth;
      const percent = offset / (item.width * item.cols);

      const speed = Math.round(10 * percent);

      increaseX = speed;
    }

    this._scroll(item, increaseX, increaseY);
  }

  private _scroll(item: ItemComponent, increaseX: number, increaseY: number): void {
    if (increaseX === 0 && increaseY === 0) return;

    if (this.grid.scrollLeft + increaseX <= 0) increaseX = 0;
    if (this.grid.scrollTop + increaseY <= 0) increaseY = 0;

    const scrollWidth = this.gridRef.nativeElement.offsetWidth + this.grid.scrollLeft;
    const gridWidth = this.grid.cols * this.grid.cellWidth * this.scale;

    // add new column if scroll is at the right
    if (scrollWidth + increaseX >= gridWidth) {
      this.grid.cols += 1;
      this._cdr.detectChanges();

      this._scroll(item, increaseX, increaseY);
      return;
    }

    const scrollHeight = this.gridRef.nativeElement.offsetHeight + this.grid.scrollTop;
    const gridHeight = this.grid.rows * this.grid.cellHeight * this.scale;

    // add new row if scroll is at the bottom
    if (scrollHeight + increaseY >= gridHeight) {
      this.grid.rows += 1;
      this._cdr.detectChanges();

      this._scroll(item, increaseX, increaseY);
      return;
    }

    this._requestAnimationFrameId = requestAnimationFrame(() => {
      this.grid.scrollLeft += increaseX;
      this.grid.scrollTop += increaseY;

      item.x += increaseX;
      item.y += increaseY;

      item.renderMove('green');

      this._isMoving = true;
      this.gridRef.nativeElement.scrollTo({
        left: this.grid.scrollLeft,
        top: this.grid.scrollTop,
        behavior: 'instant',
      });

      this._scroll(item, increaseX, increaseY);
    });
  }
}
