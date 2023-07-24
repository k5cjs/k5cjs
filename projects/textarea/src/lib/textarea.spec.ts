import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcTextarea } from './textarea';

@Component({
  imports: [KcTextarea],
})
class DumpyComponent {}

describe('KcTextarea', () => {
  let component: DumpyComponent;
  let fixture: ComponentFixture<DumpyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DumpyComponent],
    });
    fixture = TestBed.createComponent(DumpyComponent);
    component = fixture.componentInstance;

    fixture.detectChanges(); // initial binding
  });

  it('should create an instance', () => {
    void expect(component).toBeTruthy();
  });
});
