import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

export class Grid {
  cols = 10;
  rows = 10;

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

  change(item: GridItem, col: number, row: number): void {
    for (let x = item.col; x < item.col + item.cols; x++) {
      for (let y = item.row; y < item.row + item.rows; y++) {
        const over = this.matrix[y][x];

        // console.log('over', over);

        if (!over) continue;

        // if (over.isDragging) continue;

        if (over === item) continue;

        this.shiftToLeft(over, 1);
        over.rerender(over.col - 1, over.row);

        this.change(item, col, row);
      }
    }

    this.removeBy(item, col, row);
    this.add(item);

    // console.table(this.matrix);
  }

  shiftToLeft(item: GridItem, shift: number) {
    // remove cols from right
    for (let x = item.col + item.cols - shift; x < item.col + item.cols; x++) {
      for (let y = item.row; y < item.row + item.rows; y++) {
        this.matrix[y][x] = null;
      }
    }
    // add cols to left
    for (let x = item.col - shift; x < item.col; x++) {
      for (let y = item.row; y < item.row + item.rows; y++) {
        this.matrix[y][x] = item;
      }
    }
  }

  add(item: GridItem) {
    for (let x = item.col; x < item.col + item.cols; x++) {
      for (let y = item.row; y < item.row + item.rows; y++) {
        this.matrix[y][x] = item;
      }
    }
  }

  removeBy(item: GridItem, col: number, row: number) {
    for (let x = col; x < col + item.cols; x++) {
      for (let y = row; y < row + item.rows; y++) {
        this.matrix[y][x] = null;
      }
    }
  }

  remove(item: GridItem) {
    for (let x = item.col; x < item.col + item.cols; x++) {
      for (let y = item.row; y < item.row + item.rows; y++) {
        this.matrix[y][x] = null;
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

  isDragging = false;

  // scale = 0.5;
  private _scale = 1;
  //
  private _actualCellWidth = this.cellWidth * this._scale;
  private _actualCellHeight = this.cellHeight * this._scale;

  constructor(
    col: number,
    row: number,
    cols: number,
    rows: number,
    private _element: HTMLElement,
    private _container: HTMLElement,
    private _grid: Grid,
  ) {
    this._element.addEventListener('mousedown', this.onMouseDown);

    this.col = col;
    this.row = row;

    this.cols = cols;
    this.rows = rows;

    this.x = this.col * this._actualCellWidth;
    this.y = this.row * this._actualCellHeight;
  }

  rerender(col: number, row: number) {
    this.col = col;
    this.row = row;

    this.x = this.col * this._actualCellWidth;
    this.y = this.row * this._actualCellHeight;

    this.render();
  }

  scale(scale: number) {
    this.x = this.x * (scale / this._scale);
    this.y = this.y * (scale / this._scale);

    this._scale = scale;

    this._actualCellWidth = this.cellWidth * this._scale;
    this._actualCellHeight = this.cellHeight * this._scale;
  }

  render(color = 'yellow') {
    const opacity = color === 'green' ? 0.5 : 1;

    this._element.style.cssText = `
      transform: translate3d(${this.x * (1 / this._scale)}px, ${this.y * (1 / this._scale)}px, 0);
      background: ${color};
      width: ${this.cellWidth * this.cols}px;
      height: ${this.cellHeight * this.rows}px;
      opacity: ${opacity};
    `;

    const col = this.col;
    const row = this.row;

    this.col = Math.round(this.x / this._actualCellWidth);
    if (this.col < 0) this.col = 0;

    this.row = Math.round(this.y / this._actualCellHeight);
    if (this.row < 0) this.row = 0;

    this._grid.change(this, col, row);
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

    this.isDragging = false;

    cancelAnimationFrame(this._requestAnimationFrameId);

    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);

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

    this.isDragging = true;

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
  @ViewChild('gridItem2', { static: true }) gridItemElement2!: ElementRef<HTMLElement>;

  scale = new FormControl(1, { nonNullable: true });

  constructor(private _elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    // const grid = new Grid(this.gridElement.nativeElement);
    //
    // grid.render();
    //
    // const item1 = new GridItem(0, 1, 2, 2, this.gridItemElement0.nativeElement, this._elementRef.nativeElement, grid);
    // grid.add(item1);
    // item1.render();
    //
    // const item2 = new GridItem(3, 1, 3, 3, this.gridItemElement1.nativeElement, this._elementRef.nativeElement, grid);
    // grid.add(item2);
    // item2.render();
    //
    // const item3 = new GridItem(4, 4, 3, 3, this.gridItemElement2.nativeElement, this._elementRef.nativeElement, grid);
    // grid.add(item3);
    // item3.render();
    //
    // this.scale.valueChanges.subscribe((value) => {
    //   grid.scale(value);
    // });
  }
}
