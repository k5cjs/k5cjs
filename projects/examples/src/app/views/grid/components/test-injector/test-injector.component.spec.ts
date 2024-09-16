import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestInjectorComponent } from './test-injector.component';

describe('TestInjectorComponent', () => {
  let component: TestInjectorComponent;
  let fixture: ComponentFixture<TestInjectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestInjectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestInjectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
