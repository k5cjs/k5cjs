import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeBottomLeftComponent } from './resize-bottom-left.component';

describe('ResizeBottomLeftComponent', () => {
  let component: ResizeBottomLeftComponent;
  let fixture: ComponentFixture<ResizeBottomLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizeBottomLeftComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResizeBottomLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
