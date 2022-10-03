import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcSelectComponent } from './kc-select.component';
import { KcSelectModule } from './kc-select.module';

describe('WrappedFormControl', () => {
  let component: KcSelectComponent<unknown, unknown>;
  let fixture: ComponentFixture<KcSelectComponent<unknown, unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KcSelectComponent],
      imports: [KcSelectModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KcSelectComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
