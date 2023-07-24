import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { KcSelectModule } from '@k5cjs/select';

import { SelectSimpleComponent } from './select-simple.component';

describe('SelectSimpleComponent', () => {
  let component: SelectSimpleComponent;
  let fixture: ComponentFixture<SelectSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectSimpleComponent],
      imports: [FormsModule, ReactiveFormsModule, KcSelectModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    void expect(component).toBeTruthy();
  });
});
