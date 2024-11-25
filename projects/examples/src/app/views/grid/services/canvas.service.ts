import { Injectable } from '@angular/core';

import { KcGridService, gapSize } from '@k5cjs/grid';

@Injectable()
export class CanvasService {
  private grid!: KcGridService;
  private element!: HTMLCanvasElement;

  private _cellWidth = 0;
  private _cellHeight = 0;
  private _width = 0;
  private _height = 0;
  private _ctx!: CanvasRenderingContext2D;

  init(element: HTMLCanvasElement, grid: KcGridService): void {
    this.element = element;
    this.grid = grid;

    this._ctx = this.element.getContext('2d')!;

    const { width, height } = this.element.getBoundingClientRect();

    this._width = width;
    this._height = height;

    this._cellWidth = (width - this._colsTotalGaps()) / this.grid.cols;
    this._cellHeight = this.grid.cellHeight;

    this.element.width = width;
    this.element.height = height;
  }

  clear(): void {
    this._ctx.clearRect(0, 0, this._width, this._height);
  }

  render(...params: { x: number; y: number }[]): void {
    const [center, ...points] = params;

    points.forEach((point) => {
      this._ctx.strokeStyle = 'red';
      this._ctx.beginPath();
      this._ctx.moveTo(
        center.x * this._cellWidth + this._colsGaps(center.x),
        center.y * this._cellHeight + this._rowsGaps(center.y),
      );
      this._ctx.lineTo(
        point.x * this._cellWidth + this._colsGaps(point.x),
        point.y * this._cellHeight + this._rowsGaps(point.y),
      );
      this._ctx.stroke();

      this._ctx.fillStyle = 'red';
      this._ctx.beginPath();
      this._ctx.arc(
        point.x * this._cellWidth + this._colsGaps(point.x),
        point.y * this._cellHeight + this._rowsGaps(point.y),
        5,
        0,
        Math.PI * 2,
      );
      this._ctx.fill();
    });

    this._ctx.fillStyle = 'green';
    this._ctx.beginPath();
    this._ctx.arc(
      center.x * this._cellWidth + this._colsGaps(center.x),
      center.y * this._cellHeight + this._rowsGaps(center.y),
      5,
      0,
      Math.PI * 2,
    );
    this._ctx.fill();
  }

  private _colsGaps(x: number): number {
    return this.grid.colsGaps.slice(0, x).reduce<number>((acc, gap) => acc + gapSize(gap), 0);
  }

  private _rowsGaps(y: number): number {
    return this.grid.rowsGaps.slice(0, y).reduce<number>((acc, gap) => acc + gapSize(gap), 0);
  }

  private _colsTotalGaps(): number {
    return this.grid.colsGaps.reduce<number>((acc, gap) => acc + gapSize(gap), 0);
  }

  private _rowsTotalGaps(): number {
    return this.grid.rowsGaps.reduce<number>((acc, gap) => acc + gapSize(gap), 0);
  }
}
