import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeBottomRightComponent } from './resize-bottom-right.component';

describe('ResizeBottomRightComponent', () => {
  let component: ResizeBottomRightComponent;
  let fixture: ComponentFixture<ResizeBottomRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizeBottomRightComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResizeBottomRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
