import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendsFormFieldComponent } from './extends-form-field.component';

describe('ExtendsFormFieldComponent', () => {
  let component: ExtendsFormFieldComponent;
  let fixture: ComponentFixture<ExtendsFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendsFormFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtendsFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
