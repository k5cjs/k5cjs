import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ngIf } from './ng-if';
import { toggleY } from './toggle-y';

@Component({
  template: `
    <div @ngIf *ngIf="state">
      <div @toggleY id="child">Child</div>
    </div>
  `,
  styles: [
    `
      #child {
        width: 200px;
        font-size: 16px;
        line-height: 16px;
      }
    `,
  ],
  animations: [ngIf(), toggleY(40)],
})
class DumpyComponent {
  state = true;
}

describe('NgIf', () => {
  let component: DumpyComponent;
  let fixture: ComponentFixture<DumpyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DumpyComponent],
      imports: [BrowserAnimationsModule],
      teardown: {
        destroyAfterEach: true,
      },
    });
    fixture = TestBed.createComponent(DumpyComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    void expect(component).toBeTruthy();
  });

  it('check if child is animated', async () => {
    fixture.detectChanges();

    await new Promise((resolve) => setTimeout(resolve, 80));

    const compiled = fixture.nativeElement as HTMLElement;
    component.state = false;
    fixture.detectChanges();

    expect(compiled.querySelector<HTMLElement>('#child')).toBeTruthy();

    await new Promise((resolve) => setTimeout(resolve, 80));

    void expect(compiled.querySelector<HTMLElement>('#child')).toBeNull();
  });
});
