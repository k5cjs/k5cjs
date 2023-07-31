import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ngIf } from './ng-if';

@Component({
  animations: [ngIf],
})
class DumpyComponent {}

describe('NgIf', () => {
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
