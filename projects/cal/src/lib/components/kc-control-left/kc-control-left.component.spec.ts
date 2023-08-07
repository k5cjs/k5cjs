import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcControlLeftComponent } from './kc-control-left.component';

describe('ControlLeftComponent', () => {
  let component: KcControlLeftComponent;
  let fixture: ComponentFixture<KcControlLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KcControlLeftComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KcControlLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
