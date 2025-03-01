import { ChangeDetectionStrategy, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { K5cScrollModule } from './scroll.module';

describe('SelectionModel', () => {
  let component: DummyComponent;
  let fixture: ComponentFixture<DummyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DummyComponent, Dummy2Component],
      imports: [K5cScrollModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyComponent);
    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  it('default time', (done) => {
    component.element(10).scrollIntoView();
    setTimeout(() => expect(component.className()).toContain('k5c-disable-pointer-on-scroll'), 50);
    setTimeout(() => expect(component.className()).not.toContain('k5c-disable-pointer-on-scroll'), 200);
    setTimeout(() => done(), 210);
  });

  it('custom time', (done) => {
    const fixture = TestBed.createComponent(Dummy2Component);

    fixture.detectChanges();

    const component = fixture.componentInstance;

    component.element(10).scrollIntoView();

    setTimeout(() => expect(component.className()).toContain('k5c-disable-pointer-on-scroll'), 50);
    setTimeout(() => expect(component.className()).toContain('k5c-disable-pointer-on-scroll'), 1450);
    setTimeout(() => expect(component.className()).not.toContain('k5c-disable-pointer-on-scroll'), 1550);
    setTimeout(() => done(), 1560);
  });
});

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'k5c-dummy',
  template: `
    <div #container class="container" k5cDisablePointerOnScroll>
      <div #item *ngFor="let i of list" class="container__item"></div>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        background: green;
        width: 300px;
        height: 300px;
        overflow: auto;
      }

      .container__item {
        flex-shrink: 0;
        height: 30px;
        background: red;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DummyComponent {
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLElement>;
  @ViewChildren('item') items!: QueryList<ElementRef<HTMLElement>>;

  list: string[];

  constructor() {
    this.list = Array.from({ length: 50 }).map(() => '');
  }

  className(): string {
    return this.container.nativeElement.className;
  }

  element(index: number): HTMLElement {
    return this.items.get(index)!.nativeElement;
  }
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'k5c-dummy',
  template: `
    <div #container class="container" [k5cDisablePointerOnScroll]="1500">
      <div #item *ngFor="let i of list" class="container__item"></div>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        background: green;
        width: 300px;
        height: 300px;
        overflow: auto;
      }

      .container__item {
        flex-shrink: 0;
        height: 30px;
        background: red;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class Dummy2Component {
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLElement>;
  @ViewChildren('item') items!: QueryList<ElementRef<HTMLElement>>;

  list: string[];

  constructor() {
    this.list = Array.from({ length: 50 }).map(() => '');
  }

  className(): string {
    return this.container.nativeElement.className;
  }

  element(index: number): HTMLElement {
    return this.items.get(index)!.nativeElement;
  }
}
