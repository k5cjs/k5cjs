import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

export class Grid {
  cols = 15;
  rows = 55;

  cellWidth = 100;
  cellHeight = 50;

  matrix: (GridItem | null)[][] = [];

  girdLines?: HTMLElement;

  constructor(private _element: HTMLElement) {
    this.matrix = Array.from({ length: this.rows }, () => Array.from({ length: this.cols }, () => null));
  }

  render() {
    this._element.style.cssText = `
      position: relative;
      width: ${this.cols * this.cellWidth}px;
      height: ${this.rows * this.cellHeight}px;
    `;

    this.girdLines?.remove();

    this.girdLines = document.createElement('div');

    this.girdLines.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: repeat(${this.cols}, 1fr);
      grid-template-rows: repeat(${this.rows}, 1fr);
      border: 1px solid #000;
    `;

    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        const cell = document.createElement('div');
        cell.style.cssText = `
          border: 1px solid #000;
        `;
        this.girdLines.appendChild(cell);
      }
    }

    this._element.appendChild(this.girdLines);
  }

  add(item: GridItem) {
    for (let x = 0; x < item.cols; x++) {
      for (let y = 0; y < item.rows; y++) {
        this.matrix[item.row + y][item.col + x] = item;
      }
    }

    item.render();
  }

  change(col: number, row: number, item: GridItem): void {
    for (let x = 0; x < item.cols; x++) {
      for (let y = 0; y < item.rows; y++) {
        const cellItem = this.matrix[row + y][col + x];
        if (cellItem === item) continue;

        if (!cellItem) continue;

        cellItem.row += 1;
        // cellItem.y += 50 * cellItem._scale;
        cellItem.render();
      }
    }
  }

  scale(scale: number): void {
    this._element.style.transform = `scale(${scale})`;

    this.matrix.forEach((row) => {
      row.forEach((item) => {
        if (!item) return;

        item.scale(scale);
      });
    });
  }
}

export class GridItem {
  /**
   * position in grid
   */
  col: number;
  row: number;
  /**
   * cell dimensions
   */
  cellWidth = 100;
  cellHeight = 50;
  /**
   * size in grid
   */
  cols = 3;
  rows = 3;
  /**
   * relative position in grid
   */
  x: number;
  y: number;
  /**
   * mouse position
   */
  mouseX = 0;
  mouseY = 0;
  /**
   * offset from left top corner to mouse position
   */
  offsetTop = 0;
  offsetLeft = 0;

  /////

  /**
   * scroll position of container
   */
  scrollTop = 0;
  scrollLeft = 0;

  // scale = 0.5;
  private _scale = 1;
  //
  private _actualCellWidth = this.cellWidth * this._scale;
  private _actualCellHeight = this.cellHeight * this._scale;

  constructor(
    col: number,
    row: number,
    private _element: HTMLElement,
    private _container: HTMLElement,
    private _grid: Grid,
  ) {
    this._element.addEventListener('mousedown', this.onMouseDown);

    this.col = col;
    this.row = row;

    this.x = this.col * this._actualCellWidth;
    this.y = this.row * this._actualCellHeight;
  }

  scale(scale: number) {
    this.x = this.x * (scale / this._scale);
    this.y = this.y * (scale / this._scale);

    this._scale = scale;

    this._actualCellWidth = this.cellWidth * this._scale;
    this._actualCellHeight = this.cellHeight * this._scale;
  }

  render(color = 'yellow') {
    this._element.style.cssText = `
      transform: translate3d(${this.x * (1 / this._scale)}px, ${this.y * (1 / this._scale)}px, 0);
      background: ${color};
      width: ${this.cellWidth * this.cols}px;
      height: ${this.cellHeight * this.rows}px;
    `;

    this.col = Math.round(this.x / this._actualCellWidth);
    if (this.col < 0) this.col = 0;

    this.row = Math.round(this.y / this._actualCellHeight);
    if (this.row < 0) this.row = 0;

    // this._grid.change(this.col, this.row, this);
  }

  private _requestAnimationFrameId = 0;

  onMouseMove = (e: MouseEvent) => {
    e.preventDefault();

    cancelAnimationFrame(this._requestAnimationFrameId);

    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    this.x = this.mouseX + this.scrollLeft - this.offsetLeft;
    this.y = this.mouseY + this.scrollTop - this.offsetTop;

    this.render('green');

    this._scrollY();
  };

  onMouseUp = (e: MouseEvent) => {
    e.preventDefault();

    cancelAnimationFrame(this._requestAnimationFrameId);

    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);

    console.table({
      x: this.x,
      y: this.y,
      col: this.col,
      row: this.row,
    });

    this.col = Math.trunc(this.x / this._actualCellWidth);
    if (this.col < 0) this.col = 0;

    this.row = Math.trunc(this.y / this._actualCellHeight);
    if (this.row < 0) this.row = 0;

    this.x = this.col * this._actualCellWidth;
    this.y = this.row * this._actualCellHeight;

    this.render('orange');
  };

  onMouseDown = (e: MouseEvent) => {
    e.preventDefault();

    this.scrollLeft = this._container.scrollLeft;
    this.scrollTop = this._container.scrollTop;

    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    this.offsetLeft = this.mouseX + this.scrollLeft - this.x;
    this.offsetTop = this.mouseY + this.scrollTop - this.y;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  };

  private _scrollY() {
    if (this.mouseY - this.offsetTop < 0) {
      const offset = Math.abs(this.mouseY - this.offsetTop);
      const percent = offset / 150;

      const speed = Math.round(1 + percent * 15);

      this._scrollUp(speed);
    } else if (this.mouseY - this.offsetTop + 150 > this._container.clientHeight) {
      const offset = this.mouseY - this.offsetTop + 150 - this._container.clientHeight;
      const percent = offset / 150;

      const speed = Math.round(1 + percent * 15);

      this._scrollDown(speed);
    }
  }

  private _scrollUp(speed: number) {
    if (this.scrollTop <= 0) return;

    this._requestAnimationFrameId = requestAnimationFrame(() => {
      this.scrollTop -= speed;
      this.y -= speed;

      this._container.scrollTo({ top: this.scrollTop, behavior: 'instant' });
      this.render('red');

      this._scrollUp(speed);
    });
  }

  private _scrollDown(speed: number) {
    // add new row if scroll is at the bottom
    if (this._container.scrollHeight <= this.scrollTop + this._container.offsetHeight + speed) {
      this._grid.rows += 1;
      this._grid.render();

      this._scrollDown(speed);

      return;
    }

    this._requestAnimationFrameId = requestAnimationFrame(() => {
      this.scrollTop += speed;
      this.y += speed;

      this._container.scrollTo({ top: this.scrollTop, behavior: 'instant' });
      this.render('red');

      this._scrollDown(speed);
    });
  }
}

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent implements OnInit {
  @ViewChild('grid', { static: true }) gridElement!: ElementRef<HTMLElement>;
  @ViewChild('gridItem0', { static: true }) gridItemElement0!: ElementRef<HTMLElement>;
  @ViewChild('gridItem1', { static: true }) gridItemElement1!: ElementRef<HTMLElement>;

  scale = new FormControl(1, { nonNullable: true });

  constructor(private _elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const grid = new Grid(this.gridElement.nativeElement);

    grid.render();

    grid.add(new GridItem(3, 3, this.gridItemElement0.nativeElement, this._elementRef.nativeElement, grid));
    grid.add(new GridItem(3, 10, this.gridItemElement1.nativeElement, this._elementRef.nativeElement, grid));

    this.scale.valueChanges.subscribe((value) => {
      grid.scale(value);
    });
  }
}
