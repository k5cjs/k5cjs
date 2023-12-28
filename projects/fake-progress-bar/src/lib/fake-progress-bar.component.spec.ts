import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { K5cFakeProgressBarComponent } from './fake-progress-bar.component';
import { K5cFakeProgressBarService } from './fake-progress-bar.service';

describe('K5cFakeProgressBarComponent', () => {
  let component: K5cFakeProgressBarComponent;
  let fixture: ComponentFixture<K5cFakeProgressBarComponent>;
  let service: K5cFakeProgressBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [K5cFakeProgressBarComponent],
    });
    fixture = TestBed.createComponent(K5cFakeProgressBarComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(K5cFakeProgressBarService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test value', fakeAsync(() => {
    let value = 0;
    component.width$.subscribe((progress) => (value = progress));

    service.start();

    tick(3000);

    expect(value).toBeGreaterThan(0.94);
  }));
});
