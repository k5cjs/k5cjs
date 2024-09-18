import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  Input,
  OnChanges,
  SimpleChanges,
  forwardRef,
  inject,
} from '@angular/core';

import { KcGridItem } from '../../types';
import { GRID_ITEM_ID, GRID_TEMPLATE, GridItemTemplate, ITEM_COMPONENT } from '../../tokens';
import { GridItemDirective } from '../../directives';
import { KcGridService } from '../../services';

@Component({
  selector: 'kc-grid-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ITEM_COMPONENT,
      useFactory: (component: ItemComponent) => component,
      deps: [forwardRef(() => ItemComponent)],
    },
    {
      provide: GRID_ITEM_ID,
      useFactory: (component: ItemComponent) => component.id,
      deps: [forwardRef(() => ItemComponent)],
    },
  ],
})
export class ItemComponent<T = void> implements OnChanges, GridItemTemplate {
  @Input({ required: true }) id!: symbol;
  @Input({ required: true }) item!: KcGridItem<T>;

  @Input({ required: true }) gridRef!: HTMLElement;
  @Input({ required: true }) scale!: number;

  @Input({ required: true }) gridItem!: GridItemDirective<T>;

  elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  injector = inject(Injector);

  skip = false;

  protected _grid = inject(KcGridService);
  protected _gridTemplate = inject(GRID_TEMPLATE);

  ngOnChanges({ item }: SimpleChanges): void {
    // don't render if the item is changed from outside of the component
    // example: when the item is changed by the move directive or resize directive
    if (this.skip) return;

    // animate the item when it's not the first change
    if (item && !item.firstChange) this._renderWithAnimations();
    // don't animate the item when it's the first render
    else this._render();
  }

  private _renderWithAnimations() {
    // add transition time to animate the item
    this.elementRef.nativeElement.style.transition = '300ms';

    this._render();

    // remove transition time after animation is finished
    this.elementRef.nativeElement.addEventListener(
      'transitionend',
      () => (this.elementRef.nativeElement.style.transition = ''),
      { once: true },
    );
  }

  private _render() {
    const element = this.elementRef.nativeElement;

    this._setWidthByCols(element);
    this._setHeightByRows(element);
    this._setTransform(element);

    element.style.background = '';
    element.style.zIndex = '';
  }

  private _setTransform(element: HTMLElement): void {
    const totalColsGaps = this._grid.colsGaps.reduce((acc, gap) => acc + gap, 0);
    const totalRowsGaps = this._grid.rowsGaps.reduce((acc, gap) => acc + gap, 0);

    const colGaps = this._grid.colsGaps.slice(0, this.item.col).reduce((acc, gap) => acc + gap, 0);
    const rowGaps = this._grid.rowsGaps.slice(0, this.item.row).reduce((acc, gap) => acc + gap, 0);

    const xx = this.item.col / this._grid.cols;
    const yy = this.item.row / this._grid.rows;

    // eslint-disable-next-line max-len
    element.style.transform = `translate(calc((100cqw - ${totalColsGaps}px) * ${xx} + ${colGaps}px), calc((100cqh - ${totalRowsGaps}px) * ${yy} + ${rowGaps}px))`;
  }

  private _setWidthByCols(element: HTMLElement): void {
    const totalColsGaps = this._grid.colsGaps.reduce((acc, gap) => acc + gap, 0);

    // gaps between start column and end column of the item
    const gapsInCols = this._grid.colsGaps
      .slice(this.item.col, this.item.col + this.item.cols - 1)
      .reduce((acc, gap) => acc + gap, 0);

    element.style.width = `calc((100cqw - ${totalColsGaps}px) / ${this._grid.cols} * ${this.item.cols} + ${gapsInCols}px)`;
  }

  private _setHeightByRows(element: HTMLElement): void {
    const totalRowsGaps = this._grid.rowsGaps.reduce((acc, gap) => acc + gap, 0);

    // gaps between start row and end row of the item
    const gapsInRows = this._grid.rowsGaps
      .slice(this.item.row, this.item.row + this.item.rows - 1)
      .reduce((acc, gap) => acc + gap, 0);

    element.style.height = `calc((100cqh - ${totalRowsGaps}px) / ${this._grid.rows} * ${this.item.rows} + ${gapsInRows}px)`;
  }
}
