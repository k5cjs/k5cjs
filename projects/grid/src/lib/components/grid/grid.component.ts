import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  forwardRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { GridDirective, GridItemDirective, PreviewDirective, ScrollDirective } from '../../directives';
import { KcGridService } from '../../services';
import { GridEvent, KcGridItems } from '../../types';
import { GRID_TEMPLATE, GridTemplate } from '../../tokens';

@Component({
  selector: 'kc-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    KcGridService,
    {
      provide: GRID_TEMPLATE,
      useFactory: (component: GridComponent) => component,
      deps: [forwardRef(() => GridComponent)],
    },
  ],
  hostDirectives: [
    {
      directive: ScrollDirective,
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

  @Output() readonly changes = new EventEmitter<KcGridItems<T>>();

  @ViewChild('gridRef', { static: true }) containerElementRef!: ElementRef<HTMLElement>;
  @ViewChild('content', { static: true }) contentElementRef!: ElementRef<HTMLElement>;
  @ViewChild('items', { static: true }) itemsElementRef!: ElementRef<HTMLElement>;

  @ViewChild(GridDirective, { static: true }) gridElement!: GridDirective;
  @ViewChild(PreviewDirective, { static: true }) preview!: PreviewDirective;

  @ContentChild(GridItemDirective, { static: true }) gridItem!: GridItemDirective<T>;

  colsTotalGaps!: number;
  rowsTotalGaps!: number;

  grid = inject(KcGridService);

  private _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private _destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.grid.changes
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((items) => this.changes.emit(items as unknown as KcGridItems<T>));

    this.colsTotalGaps = this._colsTotalGaps();
    this.rowsTotalGaps = this._rowsTotalGaps();

    const preview = this.preview.render(
      Symbol('default'),
      { col: 0, row: 0, cols: 0, rows: 0 },
      GridEvent.AfterAddRows,
    );

    this.grid.init({
      cols: this.cols,
      rows: this.rows,
      colsGaps: this.colsGaps,
      rowsGaps: this.rowsGaps,
      cellWidth: 100,
      cellHeight: 100,
      preview,
      itemDirective: this.gridElement,
      scrollTop: this.containerElementRef.nativeElement.scrollTop,
      scrollLeft: this.containerElementRef.nativeElement.scrollLeft,
      changeDetectorRef: this._cdr,
    });

    this.items.forEach((item) => this.grid.add(item));
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
