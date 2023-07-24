import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcDropdownModule } from '../../dropdown.module';

import { KcDropdownComponent } from './dropdown.component';

describe('KcDropdownComponent', () => {
  let component: KcDropdownComponent;
  let fixture: ComponentFixture<KcDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KcDropdownComponent],
      imports: [KcDropdownModule],
    });
    fixture = TestBed.createComponent(KcDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
