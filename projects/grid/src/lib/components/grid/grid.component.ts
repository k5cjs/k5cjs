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
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  BackgroundDirective,
  GridDirective,
  GridItemDirective,
  PreviewDirective,
  ScrollDirective,
} from '../../directives';
import { KcGridService } from '../../services';
import { Gaps, KcGridItem, KcGridItems } from '../../types';
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
  set colsGaps(value: Gaps) {
    this._colsGaps = new Array(this.cols).fill(0).map((_, i) => value[i] ?? value[0]) as Gaps;
  }
  get colsGaps(): Gaps {
    return this._colsGaps;
  }

  private _colsGaps: Gaps = [10];

  @Input()
  set rowsGaps(value: Gaps) {
    this._rowsGaps = new Array(this.rows).fill(0).map((_, i) => value[i] ?? value[0]) as Gaps;
  }
  get rowsGaps(): Gaps {
    return this._rowsGaps;
  }
  _rowsGaps: Gaps = [10];

  @Input({ transform: (value: string | number) => coerceNumberProperty(value) }) countOfColsToAdd?: number;
  @Input({ transform: (value: string | number) => coerceNumberProperty(value) }) countOfRowsToAdd?: number;

  @Output() readonly itemsChanges = new EventEmitter<KcGridItems<T>>();
  @Output() readonly gridChanges = new EventEmitter<{ cols: number; rows: number }>();

  @ViewChild('content', { static: true }) contentElementRef!: ElementRef<HTMLElement>;
  @ViewChild('items', { static: true }) itemsElementRef!: ElementRef<HTMLElement>;

  @ViewChild(GridDirective, { static: true }) gridElement!: GridDirective;
  @ContentChild(PreviewDirective, { static: true }) preview!: PreviewDirective;

  @ContentChild(GridItemDirective, { static: true }) gridItem!: GridItemDirective<T>;
  @ContentChild(BackgroundDirective, { static: true }) background?: GridItemDirective;

  @ViewChild('header', { static: true }) header!: ElementRef<HTMLElement>;
  @ViewChild('footer', { static: true }) footer!: ElementRef<HTMLElement>;

  containerElementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  grid = inject<KcGridService>(KcGridService);

  private _destroyRef = inject(DestroyRef);
  private _cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.grid.gridChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((config) => this.gridChanges.emit(config));

    this.grid.itemsChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((items) => this.itemsChanges.emit(items.map((item) => item.context as KcGridItem<T>)));

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
      footer: this.footer.nativeElement,
      header: this.header.nativeElement,
      countOfColsToAdd: this.countOfColsToAdd,
      countOfRowsToAdd: this.countOfRowsToAdd,
      cdr: this._cdr,
    });

    this.items.forEach((item) => this.grid.add(item, { emitEvent: false }));
  }
}
