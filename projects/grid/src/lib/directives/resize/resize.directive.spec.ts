import { Component, Directive, ElementRef, HostListener, ViewChild, forwardRef, inject } from '@angular/core';
import { ResizeDirective } from './resize.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GRID_ITEM_ID, GRID_TEMPLATE, GridItemTemplate, GridTemplate, ITEM_COMPONENT } from '../../tokens';
import { KcGridService } from '../../services';

@Directive({
  selector: '[kcGridResize]',
})
class TestResizeDirective extends ResizeDirective {
  mouseMoved = false;

  @HostListener('mousemove', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override _onMouseMove(_e: MouseEvent): void {
    if (!this._isMouseDown) return;

    this.mouseMoved = true;
  }

  test() {
    return {
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height,
      mouseOffsetTop: this._mouseOffsetTop,
      mouseOffsetBottom: this._mouseOffsetBottom,
      mouseOffsetLeft: this._mouseOffsetLeft,
      mouseOffsetRight: this._mouseOffsetRight,
      isMouseDown: this._isMouseDown,
    };
  }

  setMouseDown(value: boolean) {
    this._isMouseDown = value;
  }

  calcY(e: MouseEvent): number {
    return this._calcY(e);
  }

  calcX(e: MouseEvent): number {
    return this._calcX(e);
  }

  render({ x, y, width, height }: { x: number; y: number; width: number; height: number }): void {
    this._render({ x, y, width, height });
  }

  col(x: number): number {
    return this._col(x);
  }

  row(y: number): number {
    return this._row(y);
  }

  cellWidth(): number {
    return this._cellWidth();
  }

  cellHeight(): number {
    return this._cellHeight();
  }
}

@Component({
  selector: 'kc-grid-test',
  template: `
    <div #container id="container">
      <div #content id="content">
        <div #items id="items">
          <div #item id="item">
            <div id="resize" kcGridResize [item]="item">Resize</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    #container {
      position: absolute;
      top: 0;
      left: 0;
      width: 500px;
      height: 500px;
    }
    #item {
      width: 100px;
      height: 100px;
    }
  `,
  providers: [
    {
      provide: KcGridService,
      useValue: {
        get cols() {
          return 0;
        },
        get rows() {
          return 0;
        },
        get scrollLeft() {
          return 0;
        },
        get scrollTop() {
          return 0;
        },
        get colsGaps() {
          return [];
        },
        get rowsGaps() {
          return [];
        },
        emit: () => {},
        drop: () => {},
      },
    },
    {
      provide: GRID_TEMPLATE,
      useFactory: (component: DumpyComponent) => component,
      deps: [forwardRef(() => DumpyComponent)],
    },
    {
      provide: ITEM_COMPONENT,
      useFactory: (component: DumpyComponent) => component,
      deps: [forwardRef(() => DumpyComponent)],
    },
  ],
})
class DumpyComponent implements GridItemTemplate, GridTemplate {
  @ViewChild(TestResizeDirective) directive!: TestResizeDirective;

  // GridTemplate
  @ViewChild('container') containerElementRef!: ElementRef<HTMLElement>;
  @ViewChild('content') contentElementRef!: ElementRef<HTMLElement>;
  @ViewChild('items') itemsElementRef!: ElementRef<HTMLElement>;

  // GridItemTemplate
  @ViewChild('item') elementRef!: ElementRef<HTMLElement>;
  skip: boolean = false;

  grid = inject(KcGridService);

  item = {
    col: 0,
    row: 0,
    cols: 3,
    rows: 3,
  };
}

describe('ResizeDirective', () => {
  let component: DumpyComponent;
  let fixture: ComponentFixture<DumpyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DumpyComponent, TestResizeDirective],
      providers: [{ provide: GRID_ITEM_ID, useValue: Symbol('id') }],
      teardown: {
        destroyAfterEach: true,
      },
    });

    fixture = TestBed.createComponent(DumpyComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test item position and dimensions', () => {
    const root: HTMLElement = fixture.nativeElement;

    const element = root.querySelector<HTMLElement>('#resize')!;

    element.dispatchEvent(new MouseEvent('mousedown', { clientX: 10, clientY: 10, cancelable: true }));

    fixture.changeDetectorRef.detectChanges();

    let test = component.directive.test();

    expect(test.x).toEqual(0);
    expect(test.y).toEqual(0);
    expect(test.width).toEqual(100);
    expect(test.height).toEqual(100);

    const items = root.querySelector<HTMLElement>('#items')!;
    items.style.paddingTop = '10px';
    items.style.paddingLeft = '10px';

    element.dispatchEvent(new MouseEvent('mousedown', { clientX: 10, clientY: 10, cancelable: true }));

    fixture.changeDetectorRef.detectChanges();

    test = component.directive.test();

    expect(test.x).toEqual(10);
    expect(test.y).toEqual(10);
  });

  it('test mouse position', () => {
    const root: HTMLElement = fixture.nativeElement;

    const element = root.querySelector<HTMLElement>('#resize')!;

    element.dispatchEvent(new MouseEvent('mousedown', { clientX: 10, clientY: 10, cancelable: true }));

    fixture.changeDetectorRef.detectChanges();

    let test = component.directive.test();

    expect(test.mouseOffsetTop).toEqual(10);
    expect(test.mouseOffsetBottom).toEqual(90);
    expect(test.mouseOffsetLeft).toEqual(10);
    expect(test.mouseOffsetRight).toEqual(90);

    const container = root.querySelector<HTMLElement>('#container')!;
    container.style.top = '10px';
    container.style.left = '10px';

    element.dispatchEvent(new MouseEvent('mousedown', { clientX: 15, clientY: 15, cancelable: true }));

    fixture.changeDetectorRef.detectChanges();

    test = component.directive.test();

    expect(test.mouseOffsetTop).toEqual(5);
    expect(test.mouseOffsetBottom).toEqual(95);
    expect(test.mouseOffsetLeft).toEqual(5);
    expect(test.mouseOffsetRight).toEqual(95);
  });

  it('check if the mouse is down to prevent the move event from working without the user pressing the mouse', () => {
    const root: HTMLElement = fixture.nativeElement;

    const element = root.querySelector<HTMLElement>('#resize')!;

    element.dispatchEvent(new MouseEvent('mousemove', { clientX: 15, clientY: 15, cancelable: true }));

    fixture.changeDetectorRef.detectChanges();

    let test = component.directive.test();

    expect(test.isMouseDown).toBeFalse();
    expect(component.directive.mouseMoved).toBeFalse();

    element.dispatchEvent(new MouseEvent('mousedown', { clientX: 10, clientY: 10, cancelable: true }));

    fixture.changeDetectorRef.detectChanges();

    test = component.directive.test();

    expect(test.isMouseDown).toBeTrue();
    expect(component.directive.mouseMoved).toBeFalse();

    element.dispatchEvent(new MouseEvent('mousemove', { clientX: 15, clientY: 15, cancelable: true }));

    fixture.changeDetectorRef.detectChanges();

    test = component.directive.test();

    expect(test.isMouseDown).toBeTrue();
    expect(component.directive.mouseMoved).toBeTrue();

    window.dispatchEvent(new MouseEvent('mouseup', { clientX: 15, clientY: 15, cancelable: true }));

    fixture.changeDetectorRef.detectChanges();

    test = component.directive.test();

    expect(test.isMouseDown).toBeFalse();
  });

  it('check if skip render when mouse is down', () => {
    const root: HTMLElement = fixture.nativeElement;

    const element = root.querySelector<HTMLElement>('#resize')!;

    element.dispatchEvent(new MouseEvent('mousedown', { clientX: 10, clientY: 10, cancelable: true }));

    fixture.changeDetectorRef.detectChanges();

    expect(component.skip).toBeTrue();
  });

  it('check if mouse up is skip if mouse is not down', () => {
    component.directive.setMouseDown(false);
    component.skip = true;

    window.dispatchEvent(new MouseEvent('mouseup', { clientX: 15, clientY: 15, cancelable: true }));

    fixture.changeDetectorRef.detectChanges();

    expect(component.skip).toBeTrue();
  });

  it('check render function', () => {
    component.directive.render({ x: 25, y: 30, width: 125, height: 130 });

    fixture.changeDetectorRef.detectChanges();

    const root: HTMLElement = fixture.nativeElement;
    const element = root.querySelector<HTMLElement>('#item')!;

    const { x, y, width, height } = element.getBoundingClientRect();

    expect(x).toEqual(25);
    expect(y).toEqual(30);
    expect(width).toEqual(125);
    expect(height).toEqual(130);
  });

  it('check calculate x and y', () => {
    const root: HTMLElement = fixture.nativeElement;
    const items = root.querySelector<HTMLElement>('#items')!;

    items.style.marginLeft = '20px';
    items.style.marginTop = '15px';

    // spyOn scrollTop from grid service
    spyOnProperty(component.grid, 'scrollLeft', 'get').and.returnValue(15);
    spyOnProperty(component.grid, 'scrollTop', 'get').and.returnValue(5);

    const mouseEvent = new MouseEvent('mousedown', { clientX: 50, clientY: 60, cancelable: true });

    const calX = component.directive.calcX(mouseEvent);
    const calY = component.directive.calcY(mouseEvent);

    expect(calX).toEqual(45);
    expect(calY).toEqual(50);
  });

  it('check calculate col', () => {
    const root: HTMLElement = fixture.nativeElement;
    const items = root.querySelector<HTMLElement>('#items')!;

    items.style.width = '555px';

    // spyOn scrollTop from grid service
    spyOnProperty(component.grid, 'cols', 'get').and.returnValue(5);
    spyOnProperty(component.grid, 'colsGaps', 'get').and.returnValue([10, 25, 10, 10]);

    const col = component.directive.col(240);

    expect(col).toEqual(2);
  });

  it('check calculate col if is outside of grid', () => {
    const root: HTMLElement = fixture.nativeElement;
    const items = root.querySelector<HTMLElement>('#items')!;

    items.style.width = '555px';

    // spyOn scrollTop from grid service
    spyOnProperty(component.grid, 'cols', 'get').and.returnValue(5);
    spyOnProperty(component.grid, 'colsGaps', 'get').and.returnValue([10, 25, 10, 10]);

    const col = component.directive.col(600);

    expect(col).toEqual(4);
  });

  it('check calculate col if is outside of grid in left part', () => {
    const root: HTMLElement = fixture.nativeElement;
    const items = root.querySelector<HTMLElement>('#items')!;

    items.style.width = '555px';

    // spyOn scrollTop from grid service
    spyOnProperty(component.grid, 'cols', 'get').and.returnValue(5);
    spyOnProperty(component.grid, 'colsGaps', 'get').and.returnValue([10, 25, 10, 10]);

    const col = component.directive.col(-200);

    expect(col).toEqual(0);
  });

  it('check calculate row', () => {
    const root: HTMLElement = fixture.nativeElement;
    const items = root.querySelector<HTMLElement>('#items')!;

    items.style.height = '555px';

    // spyOn scrollTop from grid service
    spyOnProperty(component.grid, 'rows', 'get').and.returnValue(5);
    spyOnProperty(component.grid, 'rowsGaps', 'get').and.returnValue([10, 25, 10, 10]);

    const row = component.directive.row(240);

    expect(row).toEqual(2);
  });

  it('check calculate row if is outside of grid', () => {
    const root: HTMLElement = fixture.nativeElement;
    const items = root.querySelector<HTMLElement>('#items')!;

    items.style.height = '555px';

    // spyOn scrollTop from grid service
    spyOnProperty(component.grid, 'rows', 'get').and.returnValue(5);
    spyOnProperty(component.grid, 'rowsGaps', 'get').and.returnValue([10, 25, 10, 10]);

    const row = component.directive.row(600);

    expect(row).toEqual(4);
  });

  it('check calculate row if is outside of grid in left part', () => {
    const root: HTMLElement = fixture.nativeElement;
    const items = root.querySelector<HTMLElement>('#items')!;

    items.style.height = '555px';

    // spyOn scrollTop from grid service
    spyOnProperty(component.grid, 'rows', 'get').and.returnValue(5);
    spyOnProperty(component.grid, 'rowsGaps', 'get').and.returnValue([10, 25, 10, 10]);

    const row = component.directive.row(-200);

    expect(row).toEqual(0);
  });
});
