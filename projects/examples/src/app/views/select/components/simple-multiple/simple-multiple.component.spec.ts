import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleMultipleComponent } from './simple-multiple.component';

describe('SimpleMultipleComponent', () => {
  let component: SimpleMultipleComponent;
  let fixture: ComponentFixture<SimpleMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleMultipleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
