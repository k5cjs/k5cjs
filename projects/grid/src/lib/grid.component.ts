import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

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

  private _requestAnimationFrameId!: number;
  private _isMoving = false;

  ngOnInit(): void {
    this.grid = new Grid({
      cols: 15,
      rows: 15,
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
      { col: 5, row: 4, cols: 1, rows: 1 },
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

  move({
    offsetHeight,
    offsetWidth,
    x,
    y,
    width,
    height,
    item,
  }: {
    offsetHeight: number;
    offsetWidth: number;
    x: number;
    y: number;
    width: number;
    height: number;
    item: ItemComponent;
  }) {
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
    } else if (mouseYContainer > this.gridRef.nativeElement.clientHeight) {
      const offset = mouseYContainer - this.gridRef.nativeElement.clientHeight;
      const percent = offset / (height * item.rows);

      const speed = Math.round(20 * percent);

      increaseY = speed;

      console.log('scroll down');
    }

    if (x < 0) {
      const percent = Math.abs(x) / (width * item.cols);

      const speed = Math.round(20 * percent);

      increaseX = -speed;
    } else if (mouseXContainer > this.gridRef.nativeElement.clientWidth) {
      const offset = mouseXContainer - this.gridRef.nativeElement.clientWidth;
      const percent = offset / (width * item.cols);

      const speed = Math.round(20 * percent);

      increaseX = speed;
    }

    const increaseYPercentage = ((y + increaseY + this.grid.scrollTop) * 100) / offsetHeight - item.y;
    const increaseXPercentage = ((x + increaseX + this.grid.scrollLeft) * 100) / offsetWidth - item.x;

    this._scroll(item, increaseX, increaseY, increaseYPercentage, increaseXPercentage);
  }

  private _scroll(
    item: ItemComponent,
    increaseX: number,
    increaseY: number,
    increaseYPercentage: number,
    increaseXPercentage: number,
  ): void {
    if (increaseX === 0 && increaseY === 0) return;

    if (this.grid.scrollLeft + increaseX <= 0) increaseX = 0;

    if (this.grid.scrollTop + increaseY <= 0) increaseY = 0;

    const scrollWidth = this.gridRef.nativeElement.offsetWidth + this.grid.scrollLeft;
    const gridWidth = Math.max(
      this.grid.cols * this.grid.cellWidth * this.scale,
      this.gridRef.nativeElement.offsetWidth,
    );

    console.log(scrollWidth, increaseX, gridWidth);

    // add new column if scroll is at the right
    if (scrollWidth + increaseX > gridWidth) {
      // this.grid.cols += 1;
      // this._cdr.detectChanges();
      //
      // this._scroll(item, increaseX, increaseY, increaseYPercentage, increaseXPercentage);
      return;
    }

    const scrollHeight = this.gridRef.nativeElement.offsetHeight + this.grid.scrollTop;
    const gridHeight = Math.max(
      this.grid.rows * this.grid.cellHeight * this.scale,
      this.gridRef.nativeElement.offsetHeight,
    );

    // add new row if scroll is at the bottom
    if (scrollHeight + increaseY > gridHeight) {
      // this.grid.rows += 1;
      // this._cdr.detectChanges();
      //
      // this._scroll(item, increaseX, increaseY, increaseYPercentage, increaseXPercentage);
      return;
    }

    this._requestAnimationFrameId = requestAnimationFrame(() => {
      this.grid.scrollLeft += increaseX;
      this.grid.scrollTop += increaseY;

      item.x += increaseXPercentage;
      item.y += increaseYPercentage;

      item.renderMove('green');

      this._isMoving = true;

      this.gridRef.nativeElement.scrollTo({
        left: this.grid.scrollLeft,
        top: this.grid.scrollTop,
        behavior: 'instant',
      });

      this._scroll(item, increaseX, increaseY, increaseYPercentage, increaseXPercentage);
    });
  }
}
