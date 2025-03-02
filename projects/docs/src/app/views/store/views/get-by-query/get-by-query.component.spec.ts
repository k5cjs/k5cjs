import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetByQueryComponent } from './get-by-query.component';

describe('GetByQueryComponent', () => {
  let component: GetByQueryComponent;
  let fixture: ComponentFixture<GetByQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetByQueryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GetByQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
