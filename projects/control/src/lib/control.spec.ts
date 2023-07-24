import { Component, Directive } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcControl } from './control';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'test',
})
class TestDirective extends KcControl {}

@Component({})
class TestComponent {}

describe('InputDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, TestDirective],
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    fixture.detectChanges(); // initial binding
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
