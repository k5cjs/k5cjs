import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizeTopRightComponent } from './resize-top-right.component';

describe('ResizeTopRightComponent', () => {
  let component: ResizeTopRightComponent;
  let fixture: ComponentFixture<ResizeTopRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizeTopRightComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResizeTopRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
