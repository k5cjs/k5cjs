import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeBottomComponent } from './resize-bottom.component';

describe('ResizeBottomComponent', () => {
  let component: ResizeBottomComponent;
  let fixture: ComponentFixture<ResizeBottomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizeBottomComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResizeBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
