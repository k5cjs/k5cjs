import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeRightComponent } from './resize-right.component';

describe('ResizeRightComponent', () => {
  let component: ResizeRightComponent;
  let fixture: ComponentFixture<ResizeRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizeRightComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResizeRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
