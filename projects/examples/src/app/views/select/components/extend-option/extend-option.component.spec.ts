import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendOptionComponent } from './extend-option.component';

describe('ExtendOptionComponent', () => {
  let component: ExtendOptionComponent;
  let fixture: ComponentFixture<ExtendOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtendOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
