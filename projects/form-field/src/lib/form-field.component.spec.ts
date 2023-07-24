import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcFormField } from './form-field.component';

describe('KcFormField', () => {
  let component: KcFormField;
  let fixture: ComponentFixture<KcFormField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KcFormField],
    }).compileComponents();

    fixture = TestBed.createComponent(KcFormField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
