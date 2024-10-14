import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestInjectorChildComponent } from './test-injector-child.component';

describe('TestInjectorChildComponent', () => {
  let component: TestInjectorChildComponent;
  let fixture: ComponentFixture<TestInjectorChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestInjectorChildComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestInjectorChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
