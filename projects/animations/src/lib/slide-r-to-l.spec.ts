import { AnimationDriver } from '@angular/animations/browser';
import { MockAnimationDriver, MockAnimationPlayer } from '@angular/animations/browser/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { slideRToL } from './slide-r-to-l';

@Component({
  template: `
    <div id="state" [@slideRToL]="state">Default state</div>
  `,
  animations: [slideRToL(50)],
})
class DumpyComponent {
  state: boolean | number = false;
}

@Component({
  template: `
    <div id="state" *ngIf="state" @slideRToL>Default state</div>
  `,
  animations: [slideRToL()],
})
class Dumpy1Component {
  state = false;
}

function getLog(): MockAnimationPlayer[] {
  return MockAnimationDriver.log as MockAnimationPlayer[];
}

function resetLog() {
  MockAnimationDriver.log = [];
}

describe('Slide right to left', () => {
  let component: DumpyComponent;
  let fixture: ComponentFixture<DumpyComponent>;

  beforeEach(() => {
    resetLog();

    TestBed.configureTestingModule({
      declarations: [DumpyComponent],
      imports: [BrowserAnimationsModule],
      teardown: {
        destroyAfterEach: true,
      },
      providers: [{ provide: AnimationDriver, useClass: MockAnimationDriver }],
    });

    fixture = TestBed.createComponent(DumpyComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    void expect(component).toBeTruthy();
  });

  it('default show', fakeAsync(() => {
    component.state = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const state = compiled.querySelector<HTMLElement>('#state')!;

    let player = getLog().pop()!;
    player.finish();

    expect(state.style.opacity).toEqual('');
    expect(state.style.transform).toEqual('');

    expect(player.keyframes).toEqual([
      new Map<string, string | number>([
        ['opacity', '0'],
        ['transform', 'translateX(100%)'],
        ['offset', 0],
      ]),
      new Map<string, string | number>([
        ['opacity', '*'],
        ['transform', '*'],
        ['offset', 1],
      ]),
    ]);

    component.state = false;
    fixture.detectChanges();

    player = getLog().pop()!;
    player.finish();

    expect(state.style.opacity).toEqual('0');
    expect(state.style.transform).toEqual('translateX(100%)');

    expect(player.keyframes).toEqual([
      new Map<string, string | number>([
        ['opacity', '*'],
        ['transform', '*'],
        ['offset', 0],
      ]),
      new Map<string, string | number>([
        ['opacity', '0'],
        ['transform', 'translateX(100%)'],
        ['offset', 1],
      ]),
    ]);
  }));

  it('default time', () => {
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      declarations: [Dumpy1Component],
      imports: [BrowserAnimationsModule],
      teardown: {
        destroyAfterEach: true,
      },
      providers: [{ provide: AnimationDriver, useClass: MockAnimationDriver }],
    });

    const fixture = TestBed.createComponent(Dumpy1Component);
    const component = fixture.componentInstance;

    component.state = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const state = compiled.querySelector<HTMLElement>('#state')!;

    expect(state.style.opacity).toEqual('');
    expect(state.style.transform).toEqual('');

    const player = getLog().pop()!;

    expect(player.keyframes).toEqual([
      new Map<string, string | number>([
        ['opacity', '0'],
        ['transform', 'translateX(100%)'],
        ['offset', 0],
      ]),
      new Map<string, string | number>([
        ['opacity', '*'],
        ['transform', '*'],
        ['offset', 1],
      ]),
    ]);

    expect(player.duration).toEqual(100);
  });
});
