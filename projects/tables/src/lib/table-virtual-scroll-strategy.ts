import { CdkVirtualScrollViewport, VirtualScrollStrategy } from '@angular/cdk/scrolling';
import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject, combineLatest, distinctUntilChanged, map, shareReplay, withLatestFrom } from 'rxjs';

@Injectable()
export class TableVirtualScrollStrategy implements VirtualScrollStrategy {
  scrolledIndexChange: Observable<number>;

  private headerHeight!: number;
  private rowHeight!: number;
  private bufferSize!: number;
  private viewport!: CdkVirtualScrollViewport;

  private readonly indexChange = new Subject<number>();

  constructor(private ngZone: NgZone) {
    this.scrolledIndexChange = this.indexChange.asObservable().pipe(distinctUntilChanged());
  }

  attach(viewport: CdkVirtualScrollViewport): void {
    this.viewport = viewport;
    this.onDataLengthChanged();
    this.updateContent();
  }

  detach(): void {
    // no-op
  }

  onContentScrolled(): void {
    this.updateContent();
  }

  onDataLengthChanged(): void {
    if (this.viewport) this.viewport.setTotalContentSize(this.viewport.getDataLength() * this.rowHeight);
  }

  onContentRendered(): void {
    // no-op
  }

  onRenderedOffsetChanged(): void {
    // no-op
  }

  scrollToIndex(index: number, behavior?: ScrollBehavior): void {
    if (this.viewport) this.viewport.scrollToOffset(index * this.rowHeight + this.headerHeight, behavior);
  }

  setScrollHeight(headerHeight: number, rowHeight: number, bufferSize: number): void {
    this.headerHeight = headerHeight;
    this.rowHeight = rowHeight;
    this.bufferSize = bufferSize;
    this.updateContent();
  }

  getViewportElements<T>(source: Observable<T[]>, get: () => void, sourceTotal: Observable<number>): Observable<T[]> {
    return combineLatest([source, this.scrolledIndexChange]).pipe(
      withLatestFrom(sourceTotal),
      map(([[items, firstIndex], total]) => {
        const offsetHeight = this.viewport.getViewportSize();

        const length = this.viewport.getDataLength();
        /**
         * the number of items that can be viewed in the viewport
         */
        const range = Math.trunc(offsetHeight / this.rowHeight);
        /**
         * the first visible index.
         * we remove one position from firstIndex because firstIndex contain header
         */
        const firstIndexRow = firstIndex - 1;

        const start = Math.max(0, firstIndexRow - this.bufferSize);
        const end = Math.min(length, firstIndexRow + range + this.bufferSize);

        this.viewport.setRenderedRange({ start, end });
        /**
         *  buffer  = 4
         *  range   = 7
         *  firstIndex = 4
         *
         *  length is all items
         *  length  = 40
         *  total   = 100
         *
         *  0 item
         *  1 item
         *  2 item
         *  3 item
         *   ┌──────────────────┐
         *  4│item              │
         *  5│item              │
         *  6│item              │
         *  7│item              │
         *  8│item              │
         *  9│item              │
         * 10│item              │
         *   └──────────────────┘
         * 11 item
         * 12 item
         * 13 item
         * 14 item
         *
         * 100 - (4 + 7) < 4
         */
        if (length - (firstIndexRow + range) < this.bufferSize && length < total)
          /**
           * execute function when the index of the first element visible in the viewport changes.
           */
          void Promise.resolve().then(() => this.ngZone.run(() => get()));

        return items.slice(start, end);
      }),
      shareReplay(1),
    );
  }

  private updateContent() {
    if (this.viewport) {
      /**
       * scroll position in pixels
       */
      const scrollOffset = this.viewport.measureScrollOffset();
      /**
       * we delete the header to calculate how many rows there are
       *
       * scrollOffset   335px
       * header         35px
       * row            30px
       *
       * remove header height
       * 335 - 35 = 300px
       * 300 / 30 = 10
       * start at row 10 + 1
       */
      const firstIndex = Math.max(0, Math.trunc((scrollOffset - this.headerHeight) / this.rowHeight + 1));
      /**
       * if the start is smaller than the size of the buffer,
       * then it means that no item will be removed and we will return the start
       */
      const firstIndexRow = firstIndex - 1;
      const startBuffer = Math.min(firstIndexRow, this.bufferSize);
      const removedItems = firstIndexRow - startBuffer;
      const removedItemsSize = removedItems * this.rowHeight;

      this.viewport.setRenderedContentOffset(removedItemsSize);

      this.indexChange.next(firstIndex);
    }
  }
}
