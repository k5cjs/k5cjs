import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagnificationComponent } from './magnification.component';

describe('MagnificationComponent', () => {
  let component: MagnificationComponent;
  let fixture: ComponentFixture<MagnificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MagnificationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MagnificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
