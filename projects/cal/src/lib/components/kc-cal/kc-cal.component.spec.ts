import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcCalComponent } from './kc-cal.component';

describe('CalComponent', () => {
  let component: KcCalComponent;
  let fixture: ComponentFixture<KcCalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KcCalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KcCalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
