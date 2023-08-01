import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcError } from './form-error.directive';

@Component({
  template: `
    <span *kcError>error</span>
  `,
})
class DumpyComponent {
  @ViewChild(KcError, { static: true }) kcError!: KcError;
}

describe('KcError', () => {
  let component: DumpyComponent;
  let fixture: ComponentFixture<DumpyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DumpyComponent],
      imports: [KcError],
    });
    fixture = TestBed.createComponent(DumpyComponent);
    component = fixture.componentInstance;

    fixture.detectChanges(); // initial binding
  });

  it('should create an instance', () => {
    void expect(component).toBeTruthy();
  });

  it('check context guard', () => {
    const kcError = component.kcError;

    void expect(KcError.ngTemplateContextGuard(kcError, {})).toBeTrue();
  });

  it('check update for an error that was not rendered', () => {
    let update;
    try {
      update = component.kcError.update({});
    } catch (error) {
      update = null;
    }

    void expect(update).toEqual(undefined);
  });

  it('check destroy for an error that was not rendered', () => {
    let destroy;
    try {
      destroy = component.kcError.destroy();
    } catch (error) {
      destroy = null;
    }

    void expect(destroy).toEqual(undefined);
  });
});
