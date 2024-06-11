import { ChangeDetectionStrategy, Component, Type, inject } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { relativeToByComponent, relativeToByComponentName } from './relative-to-by-component-name.helper';

@Component({
  selector: 'kc-incorrect',
  template: `
    Dummy3
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class IncorrectComponent {}

@Component({
  selector: 'kc-dumpy3',
  template: `
    Dummy3
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class Dumpy3Component {
  private _roue = inject(ActivatedRoute);

  relative(name: string): ActivatedRoute {
    return relativeToByComponentName(this._roue, name);
  }

  relativeComponent(component: Type<unknown>): ActivatedRoute {
    return relativeToByComponent(this._roue, component);
  }
}

@Component({
  selector: 'kc-dumpy2',
  template: `
    Dummy2
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class Dumpy2Component {
  private _roue = inject(ActivatedRoute);

  relative(name: string): ActivatedRoute {
    return relativeToByComponentName(this._roue, name);
  }

  relativeComponent(component: Type<unknown>): ActivatedRoute {
    return relativeToByComponent(this._roue, component);
  }
}

@Component({
  selector: 'kc-dumpy1',
  template: `
    Dummy1
    <router-outlet name="dialog"></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class Dumpy1Component {}

@Component({
  selector: 'kc-dumpy',
  template: `
    Dummy
    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DumpyComponent {}

describe('KcTextarea', () => {
  let router: Router;
  let fixture: ComponentFixture<DumpyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DumpyComponent, Dumpy1Component, Dumpy2Component, Dumpy3Component, IncorrectComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'editor',
            component: Dumpy1Component,
            children: [
              {
                path: 'id',
                component: Dumpy2Component,
                outlet: 'dialog',
              },
              {
                path: 'id-3',
                component: Dumpy3Component,
                outlet: 'dialog',
              },
            ],
          },
        ]),
      ],
    });

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(DumpyComponent);
  });

  it('check correct component name', fakeAsync(() => {
    fixture.detectChanges();

    void router.navigateByUrl('/editor/(dialog:id)');

    flush();
    fixture.detectChanges();

    const dummy2 = fixture.debugElement.query(By.directive(Dumpy2Component)).componentInstance as Dumpy2Component;

    void expect(dummy2.relative('Dumpy1Component').component!.name).toEqual('Dumpy1Component');
    void expect(dummy2.relativeComponent(Dumpy1Component).component).toEqual(Dumpy1Component);
  }));

  it('check incorrect name component name', fakeAsync(() => {
    fixture.detectChanges();

    void router.navigateByUrl('/editor/(dialog:id)');

    flush();
    fixture.detectChanges();

    const dummy2 = fixture.debugElement.query(By.directive(Dumpy2Component)).componentInstance as Dumpy2Component;

    void expect(dummy2.relative('IncorrectComponent').component?.name).toEqual(undefined);
    void expect(dummy2.relativeComponent(IncorrectComponent).component?.name).toEqual(undefined);
  }));

  it('check navigation', fakeAsync(() => {
    fixture.detectChanges();

    void router.navigateByUrl('/editor/(dialog:id)');

    flush();
    fixture.detectChanges();

    const dummy2 = fixture.debugElement.query(By.directive(Dumpy2Component)).componentInstance as Dumpy2Component;

    void router.navigate([{ outlets: { dialog: ['id-3'] } }], { relativeTo: dummy2.relative('Dumpy1Component') });

    flush();
    fixture.detectChanges();

    const dummy3 = fixture.debugElement.query(By.directive(Dumpy3Component)).componentInstance as Dumpy3Component;

    void expect(dummy3).toBeTruthy();
  }));

  it('check navigation new function', fakeAsync(() => {
    fixture.detectChanges();

    void router.navigateByUrl('/editor/(dialog:id)');

    flush();
    fixture.detectChanges();

    const dummy2 = fixture.debugElement.query(By.directive(Dumpy2Component)).componentInstance as Dumpy2Component;

    void router.navigate([{ outlets: { dialog: ['id-3'] } }], {
      relativeTo: dummy2.relativeComponent(Dumpy1Component),
    });

    flush();
    fixture.detectChanges();

    const dummy3 = fixture.debugElement.query(By.directive(Dumpy3Component)).componentInstance as Dumpy3Component;

    void expect(dummy3).toBeTruthy();
  }));
});
