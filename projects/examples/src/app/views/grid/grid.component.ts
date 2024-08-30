import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

export class Grid {
  cols = 15;
  rows = 55;

  cellHeight = 50;
  cellWidth = 50;

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

    console.table(this.matrix);

    item.render();
  }

  change(col: number, row: number, item: GridItem): void {
    console.log('change', col, row);

    for (let x = 0; x < item.cols; x++) {
      for (let y = 0; y < item.rows; y++) {
        const cellItem = this.matrix[row + y][col + x];
        if (cellItem === item) continue;

        if (!cellItem) continue;

        console.warn('change', cellItem);
        cellItem.row += 1;
        cellItem.y += 50;
        cellItem.render();
      }
    }
  }
}

export class GridItem {
  /**
   * position in grid
   */
  col: number;
  row: number;
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
  clientX = 0;
  clientY = 0;
  /**
   * offset from left top corner to mouse position
   */
  offsetTop = 0;
  offsetLeft = 0;

  /////

  scrollTop = 0;
  scrollLeft = 0;

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

    this.x = this.col * 50;
    this.y = this.row * 50;
  }

  render(color = 'yellow') {
    this._element.style.cssText = `
      transform: translate3d(${this.x}px, ${this.y}px, 0);
      background: ${color};
    `;

    this.col = Math.round(this.x / 50);
    if (this.col < 0) this.col = 0;

    this.row = Math.round(this.y / 50);
    if (this.row < 0) this.row = 0;

    // this._grid.change(this.col, this.row, this);
  }

  private _requestAnimationFrameId = 0;

  onMouseMove = (e: MouseEvent) => {
    e.preventDefault();

    cancelAnimationFrame(this._requestAnimationFrameId);

    this.clientX = e.clientX;
    this.clientY = e.clientY;

    this.x = this.clientX + this.scrollLeft - this.offsetLeft;
    this.y = this.clientY + this.scrollTop - this.offsetTop;

    this._element.style.cssText = `
        transform: translate3d(${this.x}px, ${this.y}px, 0);
        background: green;
      `;

    this._scrollY();
  };

  onMouseUp = (e: MouseEvent) => {
    e.preventDefault();

    cancelAnimationFrame(this._requestAnimationFrameId);

    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);

    this.col = Math.round(this.x / 50);
    if (this.col < 0) this.col = 0;

    this.row = Math.round(this.y / 50);
    if (this.row < 0) this.row = 0;

    this.x = this.col * 50;
    this.y = this.row * 50;

    this.render('orange');
  };

  onMouseDown = (e: MouseEvent) => {
    e.preventDefault();

    this.scrollLeft = this._container.scrollLeft;
    this.scrollTop = this._container.scrollTop;

    this.clientX = e.clientX;
    this.clientY = e.clientY;

    this.offsetLeft = this.clientX + this.scrollLeft - this.x;
    this.offsetTop = this.clientY + this.scrollTop - this.y;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  };

  private _scrollY() {
    if (this.clientY - this.offsetTop < 0) {
      const offset = Math.abs(this.clientY - this.offsetTop);
      const percent = offset / 150;

      const speed = Math.round(1 + percent * 15);

      this._scrollUp(speed);
    } else if (this.clientY - this.offsetTop + 150 > this._container.clientHeight) {
      const offset = this.clientY - this.offsetTop + 150 - this._container.clientHeight;
      const percent = offset / 150;

      const speed = Math.round(1 + percent * 15);

      this._scrollDown(speed);
      console.log(speed);
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
    if (this._container.scrollHeight <= this.scrollTop + this._container.offsetHeight + speed) {
      this._grid.rows += 1;
      console.log('before, top: ', this._container.scrollTop, this.y);
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

  constructor(private _elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const grid = new Grid(this.gridElement.nativeElement);

    grid.render();

    grid.add(new GridItem(3, 3, this.gridItemElement0.nativeElement, this._elementRef.nativeElement, grid));
    grid.add(new GridItem(3, 10, this.gridItemElement1.nativeElement, this._elementRef.nativeElement, grid));
  }
}
