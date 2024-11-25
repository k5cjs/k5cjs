import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject } from '@angular/core';

import { KcGridService } from '@k5cjs/grid';

import { CanvasService } from '../../services';

declare global {
  interface Window {
    render(...number: { x: number; y: number }[]): void;
    release(): void;
    move(): void;
  }
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CanvasService],
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasElementRef!: ElementRef<HTMLCanvasElement>;

  private _grid = inject(KcGridService);
  private _canvas = inject(CanvasService);

  ngAfterViewInit(): void {
    this._canvas.init(this.canvasElementRef.nativeElement, this._grid);

    window.render = this._canvas.render.bind(this._canvas);
    window.release = this._canvas.clear.bind(this._canvas);
    window.move = this._canvas.clear.bind(this._canvas);
  }
}
