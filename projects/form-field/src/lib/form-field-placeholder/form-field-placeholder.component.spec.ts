import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldPlaceholderComponent } from './form-field-placeholder.component';

describe('FormFieldPlaceholderComponent', () => {
  let component: FormFieldPlaceholderComponent;
  let fixture: ComponentFixture<FormFieldPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FormFieldPlaceholderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFieldPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
