import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcFormField } from './form-field.component';

@Component({
  imports: [KcFormField],
})
class DumpyComponent {}

describe('KcFormField', () => {
  let component: DumpyComponent;
  let fixture: ComponentFixture<DumpyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DumpyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DumpyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
