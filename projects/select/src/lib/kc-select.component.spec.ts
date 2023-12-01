import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, delay, of, shareReplay } from 'rxjs';

import { KcSelectModule } from './kc-select.module';
import { KcOption } from './types';

describe('KcSelectComponent', () => {
  let component: DummyComponent;
  let fixture: ComponentFixture<DummyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [KcSelectModule, ReactiveFormsModule],
      teardown: {
        destroyAfterEach: true,
      },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('skip emit valueChanges when select is updated from control', fakeAsync(() => {
    fixture.detectChanges();

    const valueChanges = jasmine.createSpy('valueChanges');
    component.control.valueChanges.subscribe(valueChanges);

    component.control.setValue(3, { emitEvent: false });

    flush();
    fixture.detectChanges();

    expect(valueChanges).not.toHaveBeenCalled();
  }));

  it('check emit valueChanges when select is updated from control', fakeAsync(() => {
    fixture.detectChanges();

    const valueChanges = jasmine.createSpy('valueChanges');
    component.control.valueChanges.subscribe(valueChanges);

    component.control.setValue(3);

    flush();
    fixture.detectChanges();

    expect(valueChanges).toHaveBeenCalled();
  }));

  it('check if value are selected when options are observable', fakeAsync(() => {
    component.options = of(component.options as KcOption<number>[]).pipe(delay(300), shareReplay());

    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const value = compiled.querySelector('kc-value') as HTMLElement;

    expect(value.textContent).toContain('2');
  }));
});

@Component({
  selector: 'kc-dummy',
  template: `
    <kc-select [formControl]="control" [options]="options" multiple>
      <kc-value *kcValue></kc-value>

      <kc-options *kcOptions="let options" [options]="options">
        <kc-option *kcOption="let option" [option]="option"></kc-option>
      </kc-options>
    </kc-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DummyComponent {
  control = new FormControl(2);

  options: KcOption<number>[] | Observable<KcOption<number>[]> = Array.from({ length: 10 }, (_, i) => ({
    value: i,
    label: i.toString(),
  }));
}
