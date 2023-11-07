import { AnimationDriver } from '@angular/animations/browser';
import { MockAnimationDriver, MockAnimationPlayer } from '@angular/animations/browser/testing';
import { AfterContentChecked, ChangeDetectorRef, Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

import { toggleO } from './toggle-o';
import { toggleY } from './toggle-y';

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

function getLog(): MockAnimationPlayer[] {
  return MockAnimationDriver.log as MockAnimationPlayer[];
}

describe('Toggle y', () => {
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

    expect(compiled.querySelector<HTMLElement>('#state1')!.offsetHeight).toEqual(0);

    await delay(80);

    expect(compiled.querySelector<HTMLElement>('#state1')!.offsetHeight).toBeGreaterThan(0);
  });

  it('default hide', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    component.state1 = true;
    fixture.detectChanges();

    await delay(80);

    expect(compiled.querySelector<HTMLElement>('#state1')!.offsetHeight).toBeGreaterThan(0);

    component.state1 = false;
    fixture.detectChanges();

    expect(compiled.querySelector<HTMLElement>('#state1')!.offsetHeight).toBeGreaterThanOrEqual(8);

    await delay(80);

    expect(compiled.querySelector<HTMLElement>('#state1')).toBeNull();
  });

  it('boolean show', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    component.state2 = true;

    fixture.detectChanges();

    expect(compiled.querySelector<HTMLElement>('#state2')!.offsetHeight).toEqual(0);

    await delay(80);

    expect(compiled.querySelector<HTMLElement>('#state2')!.offsetHeight).toBeGreaterThan(0);
  });

  it('boolean hide', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    component.state2 = true;
    fixture.detectChanges();

    await delay(80);

    expect(compiled.querySelector<HTMLElement>('#state2')!.offsetHeight).toBeGreaterThan(0);

    component.state2 = false;
    fixture.detectChanges();

    expect(compiled.querySelector<HTMLElement>('#state2')!.offsetHeight).toBeGreaterThanOrEqual(8);

    await delay(80);

    expect(compiled.querySelector<HTMLElement>('#state2')).toBeNull();
  });

  it('increase size', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    component.state3 = true;
    component.message = 'Hello world 2';
    fixture.detectChanges();

    expect(compiled.querySelector<HTMLElement>('#state3')!.offsetHeight).toEqual(0);

    await delay(80);

    expect(compiled.querySelector<HTMLElement>('#state3')!.offsetHeight).toBeGreaterThan(0);

    component.message = 'Hello world big message two line';
    fixture.detectChanges();

    expect(compiled.querySelector<HTMLElement>('#state3')!.offsetHeight).toBeLessThanOrEqual(16);

    await delay(80);

    expect(compiled.querySelector<HTMLElement>('#state3')!.offsetHeight).toBeGreaterThan(16);
  });

  it('unknown hide', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    component.state3 = true;
    component.message = 'Hello world 2';
    fixture.detectChanges();

    await delay(80);

    component.message = 'Hello world big message two line';
    fixture.detectChanges();

    await delay(80);

    expect(compiled.querySelector<HTMLElement>('#state3')!.offsetHeight).toBeGreaterThan(16);

    component.state3 = false;
    fixture.detectChanges();

    expect(compiled.querySelector<HTMLElement>('#state3')!.offsetHeight).toBeGreaterThanOrEqual(24);

    await delay(80);

    expect(compiled.querySelector<HTMLElement>('#state1')).toBeNull();
  });

  it('unknown hide', async () => {
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

    expect(compiled.querySelector<HTMLElement>('#state1')!.offsetHeight).toEqual(0);

    await delay(30);

    expect(compiled.querySelector<HTMLElement>('#state1')!.offsetHeight).toBeGreaterThan(0);
    expect(compiled.querySelector<HTMLElement>('#state1')!.offsetHeight).toBeLessThanOrEqual(8);

    await delay(80);

    expect(compiled.querySelector<HTMLElement>('#state1')!.offsetHeight).toEqual(16);
  });

  it('nested animations', fakeAsync(() => {
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      declarations: [Dumpy2Component],
      imports: [NoopAnimationsModule],
      providers: [{ provide: AnimationDriver, useClass: MockAnimationDriver }],
      teardown: {
        destroyAfterEach: true,
      },
    });

    fixture = TestBed.createComponent(Dumpy2Component) as unknown as ComponentFixture<DumpyComponent>;
    component = fixture.componentInstance;

    component.state1 = true;

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    let player = getLog().pop()!;
    player.finish();

    expect(player.keyframes).toEqual([
      new Map<string, string | number>([
        ['overflowY', 'hidden'],
        ['height', '0'],
        ['opacity', '0'],
        ['offset', 0],
      ]),
      new Map<string, string | number>([
        ['overflowY', 'hidden'],
        ['height', '*'],
        ['opacity', '1'],
        ['offset', 1],
      ]),
    ]);

    tick(100);

    component.state2 = true;
    component.message = 'Hello world 2 test test';

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    player = getLog().pop()!;
    player.finish();

    expect(player.keyframes).toEqual([
      new Map<string, string | number>([
        ['height', '0px'],
        ['offset', 0],
      ]),
      new Map<string, string | number>([
        ['height', '*'],
        ['offset', 1],
      ]),
    ]);

    player = getLog().pop()!;
    player.finish();

    expect(player.keyframes).toEqual([
      new Map<string, string | number>([
        ['opacity', '0'],
        ['offset', 0],
      ]),
      new Map<string, string | number>([
        ['opacity', '*'],
        ['offset', 1],
      ]),
    ]);

    player = getLog().pop()!;
    player.finish();

    expect(player.keyframes).toEqual([
      new Map<string, string | number>([
        ['opacity', '0'],
        ['offset', 0],
      ]),
      new Map<string, string | number>([
        ['opacity', '0'],
        ['offset', 1],
      ]),
    ]);

    player = getLog().pop()!;
    player.finish();

    expect(player.keyframes).toEqual([
      new Map<string, string | number>([
        ['overflowY', 'hidden'],
        ['height', '0px'],
        ['opacity', '*'],
        ['offset', 0],
      ]),
      new Map<string, string | number>([
        ['overflowY', 'hidden'],
        ['height', '0px'],
        ['opacity', '*'],
        ['offset', 1],
      ]),
    ]);
  }));
});

@Component({
  template: `
    <div id="state1" *ngIf="state1" @toggleY>Default state</div>
    <div id="state2" *ngIf="state2" [@toggleY]="state2">Boolean state</div>
    <div id="state3" #ref *ngIf="state3" [@toggleY]="{ value: message, params: { height: ref.offsetHeight } }">
      {{ message }}
    </div>
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
  animations: [toggleY(40)],
})
class DumpyComponent {
  state1 = false;
  state2 = false;
  state3 = false;

  message = 'Hello world';
}

@Component({
  template: `
    <div id="state1" *ngIf="state1" @toggleY>Default state</div>
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
  animations: [toggleY()],
})
class Dumpy1Component {
  state1 = false;
}

@Component({
  template: `
    <div>test</div>
    <div id="state1" #ref *ngIf="state1" [@toggleY]="{ value: message, params: { height: ref.offsetHeight } }">
      <div @toggleO *ngIf="state2">
        {{ message }}
      </div>
    </div>
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
  animations: [toggleY(), toggleO()],
})
class Dumpy2Component implements AfterContentChecked {
  state1 = false;
  state2 = false;

  message = 'Hello world';

  constructor(private _cdr: ChangeDetectorRef) {}

  ngAfterContentChecked() {
    this._cdr.detectChanges();
  }
}
