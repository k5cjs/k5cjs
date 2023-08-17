import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { toggleO } from './toggle-o';

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

const fixtureOpacity = (fixture: ComponentFixture<unknown>) => (element: string) => {
  const htmlElement = fixture.nativeElement as HTMLElement;
  const targetElement = htmlElement.querySelector(element) as HTMLElement;

  const computedOpacity = window.getComputedStyle(targetElement).opacity;

  return parseFloat(computedOpacity);
};

@Component({
  template: `
    <div id="state1" *ngIf="state1" @toggleO>Default state</div>
    <div id="state2" *ngIf="state2" [@toggleO]="state2">Boolean state</div>
  `,
  animations: [toggleO(100)],
})
class DumpyComponent {
  state1 = false;
  state2 = false;
}

@Component({
  template: `
    <div id="state1" *ngIf="state1" @toggleO>Default state</div>
  `,
  animations: [toggleO()],
})
class Dumpy1Component {
  state1 = false;
}

describe('Toggle opacity', () => {
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

    expect(window.getComputedStyle(compiled.querySelector<HTMLElement>('#state1')!).opacity).toEqual('0');

    await delay(120);

    expect(window.getComputedStyle(compiled.querySelector<HTMLElement>('#state1')!).opacity).toEqual('1');
  });

  it('default hide', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const opacity = fixtureOpacity(fixture);
    component.state1 = true;
    fixture.detectChanges();

    await delay(70);

    expect(opacity('#state1')).toBeGreaterThan(0.5);

    component.state1 = false;
    fixture.detectChanges();

    await delay(70);

    expect(opacity('#state1')).toBeLessThan(0.5);

    await delay(70);

    expect(compiled.querySelector<HTMLElement>('#state1')).toBeNull();
  });

  it('boolean show', async () => {
    const opacity = fixtureOpacity(fixture);
    component.state2 = true;

    fixture.detectChanges();

    expect(opacity('#state2')).toEqual(0);

    await delay(70);

    expect(opacity('#state2')).toBeGreaterThan(0.5);
  });

  it('boolean hide', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const opacity = fixtureOpacity(fixture);
    component.state2 = true;
    fixture.detectChanges();

    await delay(70);

    expect(opacity('#state2')).toBeGreaterThan(0.5);

    component.state2 = false;
    fixture.detectChanges();

    await delay(70);

    expect(opacity('#state2')).toBeLessThan(0.5);

    await delay(70);

    expect(compiled.querySelector<HTMLElement>('#state2')).toBeNull();
  });

  it('test default time', async () => {
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
    const opacity = fixtureOpacity(fixture);
    component.state1 = true;
    fixture.detectChanges();

    await delay(70);

    expect(opacity('#state1')).toBeGreaterThan(0.5);

    component.state1 = false;
    fixture.detectChanges();

    await delay(70);

    expect(opacity('#state1')).toBeLessThan(0.5);

    await delay(70);

    expect(compiled.querySelector<HTMLElement>('#state1')).toBeNull();
  });
});
