import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcGroupComponent } from './kc-group.component';

describe('KcGroupComponent', () => {
  let component: KcGroupComponent;
  let fixture: ComponentFixture<KcGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KcGroupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KcGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
