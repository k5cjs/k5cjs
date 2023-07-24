import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcFormField } from '@k5cjs/form-field';
import { KcInput } from '@k5cjs/input';

import { CustomInputComponent } from './custom-input.component';

describe('CustomInputComponent', () => {
  let component: CustomInputComponent;
  let fixture: ComponentFixture<CustomInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomInputComponent],
      imports: [KcFormField, KcInput],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
