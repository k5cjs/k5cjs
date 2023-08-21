import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { slideRToL } from './slide-r-to-l';

const delay = (time: number) => {
  return new Promise<void>((resolve) => {
    const start = new Date().getTime();

    const loop = () => {
      const delta = new Date().getTime() - start;

      if (delta >= time) return resolve();

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  });
};

@Component({
  template: `
    <div id="state1" *ngIf="state1" @slideRToL>Default state</div>
  `,
  styles: [
    `
      div {
        width: 200px;
        font-size: 16px;
        line-height: 16px;
      }
    `,
  ],
  animations: [slideRToL(40)],
})
class DumpyComponent {
  state1 = false;
}

@Component({
  template: `
    <div id="state1" *ngIf="state1" @slideRToL>Default state</div>
  `,
  styles: [
    `
      div {
        width: 200px;
        font-size: 16px;
        line-height: 16px;
      }
    `,
  ],
  animations: [slideRToL()],
})
class Dumpy1Component {
  state1 = false;
}

const matrix = (exp: string) => {
  const [a, b, c, d, tx, ty] = exp
    .replace('matrix(', '')
    .replace(')', '')
    .split(',')
    .map((v) => parseFloat(v.trim()));

  return { a, b, c, d, tx, ty };
};

describe('Slide right to left', () => {
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

  it('default show', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    component.state1 = true;

    fixture.detectChanges();

    const state = compiled.querySelector<HTMLElement>('#state1')!;
    let tx = matrix(window.getComputedStyle(state).transform).tx;

    expect(tx).toEqual(200);

    await delay(20);

    tx = matrix(window.getComputedStyle(state).transform).tx;

    expect(tx).toBeLessThan(100);
  });

  it('default time', async () => {
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      declarations: [Dumpy1Component],
      imports: [BrowserAnimationsModule],
      teardown: {
        destroyAfterEach: true,
      },
    });

    const fixture = TestBed.createComponent(Dumpy1Component);
    const component = fixture.componentInstance;

    const compiled = fixture.nativeElement as HTMLElement;
    component.state1 = true;

    fixture.detectChanges();

    const state = compiled.querySelector<HTMLElement>('#state1')!;
    let tx = matrix(window.getComputedStyle(state).transform).tx;

    expect(tx).toEqual(200);

    await delay(50);

    tx = matrix(window.getComputedStyle(state).transform).tx;

    expect(tx).toBeLessThan(100);
  });
});
