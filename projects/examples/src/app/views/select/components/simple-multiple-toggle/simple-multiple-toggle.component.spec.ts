import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleMultipleToggleComponent } from './simple-multiple-toggle.component';

describe('SimpleMultipleToggleComponent', () => {
  let component: SimpleMultipleToggleComponent;
  let fixture: ComponentFixture<SimpleMultipleToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleMultipleToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleMultipleToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
