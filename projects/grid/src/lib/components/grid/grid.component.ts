import {
  ChangeDetectionStrategy,
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

import {
  BackgroundDirective,
  GridDirective,
  GridItemDirective,
  PreviewDirective,
  ScrollDirective,
} from '../../directives';
import { KcGridService } from '../../services';
import { KcGridItem, KcGridItems } from '../../types';
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

  @ViewChild('content', { static: true }) contentElementRef!: ElementRef<HTMLElement>;
  @ViewChild('items', { static: true }) itemsElementRef!: ElementRef<HTMLElement>;

  @ViewChild(GridDirective, { static: true }) gridElement!: GridDirective;
  @ContentChild(PreviewDirective, { static: true }) preview!: PreviewDirective;

  @ContentChild(GridItemDirective, { static: true }) gridItem!: GridItemDirective<T>;
  @ContentChild(BackgroundDirective, { static: true }) background?: GridItemDirective;

  colsTotalGaps!: number;
  rowsTotalGaps!: number;

  containerElementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  grid = inject<KcGridService>(KcGridService);

  private _destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.grid.changes
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((items) => this.changes.emit(items.map((item) => item.context as KcGridItem<T>)));

    this.colsTotalGaps = this._colsTotalGaps();
    this.rowsTotalGaps = this._rowsTotalGaps();

    this.grid.init({
      cols: this.cols,
      rows: this.rows,
      colsGaps: this.colsGaps,
      rowsGaps: this.rowsGaps,
      cellWidth: 100,
      cellHeight: 100,
      preview: this.preview,
      itemDirective: this.gridElement,
      scrollTop: this.containerElementRef.nativeElement.scrollTop,
      scrollLeft: this.containerElementRef.nativeElement.scrollLeft,
    });

    this.items.forEach((item) => this.grid.add(item, { emitEvent: false }));
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
