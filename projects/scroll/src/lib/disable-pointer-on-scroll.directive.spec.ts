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
    setTimeout(() => expect(component.pointerEvents()).toEqual('none'), 50);
    setTimeout(() => expect(component.pointerEvents()).toEqual('initial'), 200);
    setTimeout(() => done(), 210);
  });

  it('custom time', (done) => {
    const fixture = TestBed.createComponent(Dummy2Component);

    fixture.detectChanges();

    const component = fixture.componentInstance;

    component.element(10).scrollIntoView();
    setTimeout(() => expect(component.pointerEvents()).toEqual('none'), 50);
    setTimeout(() => expect(component.pointerEvents()).toEqual('none'), 1450);
    setTimeout(() => expect(component.pointerEvents()).toEqual('initial'), 1550);
    setTimeout(() => done(), 1560);
  });
});

@Component({
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

  pointerEvents(): string {
    return this.container.nativeElement.style.getPropertyValue('pointer-events');
  }

  element(index: number): HTMLElement {
    return this.items.get(index)!.nativeElement;
  }
}

@Component({
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

  pointerEvents(): string {
    return this.container.nativeElement.style.getPropertyValue('pointer-events');
  }

  element(index: number): HTMLElement {
    return this.items.get(index)!.nativeElement;
  }
}
