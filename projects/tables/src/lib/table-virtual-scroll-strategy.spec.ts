import { CdkVirtualScrollViewport, ScrollingModule, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Inject, Injectable, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, Observable, map, of } from 'rxjs';

import { TableVirtualScrollStrategy } from './table-virtual-scroll-strategy';

describe('SelectionModel', () => {
  let component: DummyComponent;
  let fixture: ComponentFixture<DummyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [ScrollingModule, CdkTableModule],
      providers: [DummyStoreService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyComponent);
    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  it('page height === limit height', (done) => {
    component.setConfig({
      viewportHeight: 300,
      viewportWidth: 500,
      headerHeight: 30,
      rowHeight: 30,
      buffer: 5,
      total: 50,
      limit: 10,
    });

    let step = 0;

    component.dataSource$.subscribe((items) => {
      fixture.detectChanges();

      if (step === 0) expect(items.length).toEqual(0);
      else if (step === 1) expect(items.length).toEqual(10);
      else if (step === 2) {
        expect(items.length).toEqual(14);
        done();
      }

      step++;
    });
  });

  it('page height > limit', (done) => {
    component.setConfig({
      viewportHeight: 300,
      viewportWidth: 500,
      headerHeight: 30,
      rowHeight: 30,
      buffer: 5,
      total: 50,
      limit: 5,
    });

    let step = 0;

    component.dataSource$.pipe().subscribe((items) => {
      fixture.detectChanges();

      if (step === 0) expect(items.length).toEqual(0);
      else if (step === 1) expect(items.length).toEqual(5);
      else if (step === 2) expect(items.length).toEqual(10);
      else if (step === 3) {
        expect(items.length).toEqual(14);
        done();
      }

      step++;
    });
  });

  it('scroll to index', (done) => {
    component.setConfig({
      viewportHeight: 300,
      viewportWidth: 500,
      headerHeight: 30,
      rowHeight: 30,
      buffer: 5,
      total: 100,
      limit: 20,
    });

    let step = 0;

    component.dataSource$.pipe().subscribe((items) => {
      fixture.detectChanges();

      if (step === 0) expect(items.length).toEqual(0);
      else if (step === 1) {
        expect(items.length).toEqual(14);
        setTimeout(() => component.virtualScroll.scrollToIndex(6));
      } else if (step === 3) {
        expect(items.length).toEqual(20);
        done();
      }

      step++;
    });
  });

  it('scroll to index smooth', (done) => {
    component.setConfig({
      viewportHeight: 300,
      viewportWidth: 500,
      headerHeight: 30,
      rowHeight: 30,
      buffer: 5,
      total: 100,
      limit: 30,
    });

    let step = 0;

    component.dataSource$.pipe().subscribe((items) => {
      fixture.detectChanges();

      if (step === 0) expect(items.length).toEqual(0);
      else if (step === 1) {
        expect(items.length).toEqual(14);
        setTimeout(() => component.virtualScroll.scrollToIndex(4, 'smooth'));
      } else if (step === 6) {
        expect(items.length).toEqual(19);
        done();
      }

      step++;
    });
  });

  it('scroll to index auto', (done) => {
    component.setConfig({
      viewportHeight: 300,
      viewportWidth: 500,
      headerHeight: 30,
      rowHeight: 30,
      buffer: 5,
      total: 100,
      limit: 30,
    });

    let step = 0;

    component.dataSource$.pipe().subscribe((items) => {
      fixture.detectChanges();

      if (step === 0) expect(items.length).toEqual(0);
      else if (step === 1) {
        expect(items.length).toEqual(14);
        setTimeout(() => component.virtualScroll.scrollToIndex(4, 'auto'));
      } else if (step === 2) {
        expect(items.length).toEqual(19);
        done();
      }

      step++;
    });
  });

  it('scroll to the end', (done) => {
    component.setConfig({
      viewportHeight: 300,
      viewportWidth: 500,
      headerHeight: 40,
      rowHeight: 30,
      buffer: 5,
      total: 21,
      limit: 7,
    });

    let step = 0;

    component.dataSource$.pipe().subscribe((items) => {
      fixture.detectChanges();

      if (step === 0) expect(items.length).toEqual(0);
      else if (step === 2) {
        expect(items.length).toEqual(14);
        setTimeout(() => component.virtualScroll.scrollToIndex(4));
      } else if (step === 4) {
        expect(items.length).toEqual(19);
        setTimeout(() => component.virtualScroll.scrollToIndex(9));
      } else if (step === 5) {
        expect(items.length).toEqual(17);
        setTimeout(() => component.virtualScroll.scrollToIndex(11));
        done();
      }

      step++;
    });
  });
});

interface Item {
  id: number;
  name: string;
}

@Injectable()
class DummyStoreService {
  private _data: BehaviorSubject<Item[]>;

  private _skip: number;
  private _limit: number;
  private _total: number;

  constructor() {
    this._data = new BehaviorSubject<Item[]>([]);
    this._skip = 0;
    this._limit = 10;
    this._total = 100;
  }

  setConfig(total: number, limit: number) {
    this._limit = limit;
    this._total = total;
  }

  get total(): Observable<number> {
    return this.data.pipe(map((items) => (!items.length ? Infinity : this._total)));
  }

  get data(): Observable<Item[]> {
    return this._data.asObservable();
  }

  getData(): Observable<{ total: number; skip: number; limit: number }> {
    const index = this._data.value.length;

    if (this._data.value.length < 50) {
      this._data.next([
        ...this._data.value,
        ...Array.from({ length: this._limit }).map((_, i) => {
          const id = index + i;
          const name = `Name: ${id}`;

          return { id, name };
        }),
      ]);
    }

    this._skip += this._limit;

    return of({
      limit: this._limit,
      total: this._total,
      skip: this._skip - this._limit,
    });
  }
}

@Component({
  selector: 'lib-input',
  template: `
    <!-- virtual scroll container -->
    <cdk-virtual-scroll-viewport [style.height.px]="viewportHeight" [style.width.px]="viewportWidth" class="viewport">
      <!-- table -->
      <table cdk-table [dataSource]="dataSource$">
        <ng-container cdkColumnDef="id">
          <!-- headers -->
          <th cdk-header-cell *cdkHeaderCellDef [style.height.px]="headerHeight">id</th>

          <!-- columns -->
          <td *cdkCellDef="let element" [style.height.px]="rowHeight">
            <ng-container>{{ element.id }}</ng-container>
          </td>
        </ng-container>

        <ng-container cdkColumnDef="name">
          <!-- headers -->
          <th cdk-header-cell *cdkHeaderCellDef [style.height.px]="headerHeight">name</th>

          <!-- columns -->
          <td *cdkCellDef="let element" [style.height.px]="rowHeight">
            <ng-container>{{ element.name }}</ng-container>
          </td>
        </ng-container>

        <tr cdk-header-row *cdkHeaderRowDef="['id', 'name']"></tr>

        <ng-template
          let-row
          cdkRowDef
          cdkVirtualFor
          [cdkRowDefColumns]="['id', 'name']"
          [cdkVirtualForOf]="virtualDataSource$"
        >
          <tr cdk-row></tr>
        </ng-template>
      </table>
    </cdk-virtual-scroll-viewport>
  `,
  styles: [
    `
      .viewport {
        background: green;
      }

      table {
        border-collapse: collapse;
      }

      th,
      td {
        padding: 0px;
      }
    `,
  ],
  providers: [{ provide: VIRTUAL_SCROLL_STRATEGY, useClass: TableVirtualScrollStrategy }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DummyComponent {
  @ViewChild(CdkVirtualScrollViewport, { static: true }) virtualScroll!: CdkVirtualScrollViewport;

  viewportHeight: number;
  viewportWidth: number;

  virtualDataSource$: Observable<Item[]>;
  dataSource$: Observable<Item[]>;

  headerHeight: number;
  rowHeight: number;

  constructor(
    @Inject(VIRTUAL_SCROLL_STRATEGY)
    public scrollStrategy: TableVirtualScrollStrategy,
    public dummyStore: DummyStoreService,
  ) {
    this.viewportHeight = 300;
    this.viewportWidth = 500;

    this.headerHeight = 30;
    this.rowHeight = 30;

    this.virtualDataSource$ = this.dummyStore.data;
    this.dataSource$ = this.scrollStrategy.getViewportElements(
      this.virtualDataSource$,
      () => this.dummyStore.getData(),
      this.dummyStore.total,
    );
  }

  setConfig({
    viewportHeight,
    viewportWidth,
    headerHeight,
    rowHeight,
    buffer,
    total,
    limit,
  }: {
    viewportHeight: number;
    viewportWidth: number;
    headerHeight: number;
    rowHeight: number;
    buffer: number;
    total: number;
    limit: number;
  }) {
    this.viewportHeight = viewportHeight;
    this.viewportWidth = viewportWidth;
    this.headerHeight = headerHeight;
    this.rowHeight = rowHeight;

    this.scrollStrategy.setScrollHeight(this.headerHeight, this.rowHeight, buffer);
    this.dummyStore.setConfig(total, limit);
  }
}
