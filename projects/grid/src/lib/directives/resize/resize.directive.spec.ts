import { Component, Directive, forwardRef } from '@angular/core';
import { ResizeDirective } from './resize.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GRID_ITEM_ID, GRID_TEMPLATE, ITEM_COMPONENT } from '../../tokens';
import { KcGridService } from '../../services';

@Directive({
  selector: '[kcGridResize]',
})
class TestResizeDirective extends ResizeDirective {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override _onMouseMove(_e: MouseEvent): void {
    throw new Error('Method not implemented.');
  }
  // Need to implement abstract members
}

@Component({
  selector: 'kc-grid-test',
  template: `
    <div kcGridResize [item]="item"></div>
  `,
  providers: [
    {
      provide: KcGridService,
      useValue: { cols: 0, rows: 0 },
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
class DumpyComponent {
  item = {
    col: 0,
    row: 0,
    cols: 3,
    rows: 3,
  };
}

fdescribe('ResizeDirective', () => {
  let component: DumpyComponent;
  let fixture: ComponentFixture<DumpyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DumpyComponent, TestResizeDirective],
      providers: [{ provide: GRID_ITEM_ID, useValue: Symbol('id') }],
    });

    // TestBed.runInInjectionContext(() => {
    fixture = TestBed.createComponent(DumpyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
