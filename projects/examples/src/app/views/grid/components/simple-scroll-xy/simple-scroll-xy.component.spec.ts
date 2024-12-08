import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleScrollXyComponent } from './simple-scroll-xy.component';

describe('SimpleScrollXyComponent', () => {
  let component: SimpleScrollXyComponent;
  let fixture: ComponentFixture<SimpleScrollXyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleScrollXyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleScrollXyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
