import { ScrollingModule, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { TableVirtualScrollStrategy } from '@k5cjs/tables';

type Item = { id: number };

@Component({
  selector: 'app-table-virtual-scroll',
  standalone: true,
  imports: [CommonModule, ScrollingModule, CdkTableModule],
  templateUrl: './table-virtual-scroll.component.html',
  styleUrls: ['./table-virtual-scroll.component.scss'],
  providers: [{ provide: VIRTUAL_SCROLL_STRATEGY, useClass: TableVirtualScrollStrategy }],
})
export class TableVirtualScrollComponent {
  virtualDataSource$: Observable<Item[]>;
  dataSource$: Observable<Item[]>;

  placeholderHeight = 0;

  constructor(
    @Inject(VIRTUAL_SCROLL_STRATEGY)
    private _scrollStrategy: TableVirtualScrollStrategy,
  ) {
    const data: Item[] = Array.from({ length: 1000 }).map((_, id) => ({ id }));

    const headerHeight = 40;
    const rowHeight = 40;
    const bufferSize = 50;

    this._scrollStrategy.setScrollHeight(headerHeight, rowHeight, bufferSize);

    this.virtualDataSource$ = of(data);

    this.dataSource$ = this._scrollStrategy.getViewportElements(this.virtualDataSource$, of(1000));

    this._scrollStrategy.scrolledIndexChange.subscribe((index) => {
      this.placeholderHeight = index * rowHeight;
    });
  }

  placeholderWhen(index: number) {
    return index == 0;
  }
}
