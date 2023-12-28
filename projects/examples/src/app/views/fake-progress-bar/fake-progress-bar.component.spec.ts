import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { K5cFakeProgressBarComponent } from '@k5cjs/fake-progress-bar';

import { FakeProgressBarComponent } from './fake-progress-bar.component';

describe('FakeProgressBarComponent', () => {
  let component: FakeProgressBarComponent;
  let fixture: ComponentFixture<FakeProgressBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [K5cFakeProgressBarComponent, ReactiveFormsModule],
      declarations: [FakeProgressBarComponent],
    });
    fixture = TestBed.createComponent(FakeProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
