import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KcCal, KcCalSelector } from '../../services';
import { KC_CAL_SELECTOR } from '../../tokens';
import { KcCalBaseSelector } from '../../types';

import { KcCalDayComponent } from './kc-cal-day.component';

const removeTime = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
};

describe('CalDay', () => {
  let component: KcCalDayComponent;
  let fixture: ComponentFixture<KcCalDayComponent>;
  let selector: KcCalBaseSelector<unknown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KcCalDayComponent],
      providers: [
        {
          provide: KC_CAL_SELECTOR,
          useClass: KcCalSelector,
        },
        KcCal,
        ChangeDetectorRef,
      ],
      teardown: {
        destroyAfterEach: true,
      },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KcCalDayComponent);
    component = fixture.componentInstance;
    selector = TestBed.inject(KC_CAL_SELECTOR);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('check input date', () => {
    const date = new Date();
    component.day = date;

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector<HTMLElement>('span')!.textContent).toEqual(date.getDate().toString());
  });

  it('check if day is selected', () => {
    const date = new Date();
    component.day = date;
    spyOn(selector, 'isSelected').and.returnValue(true);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(window.getComputedStyle(compiled).backgroundColor).toEqual('rgb(255, 158, 27)');
  });

  it('check if day is disabled', () => {
    const currentDate = new Date();
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
    component.day = date;

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(window.getComputedStyle(compiled).color).toEqual('rgb(148, 163, 184)');
  });

  it('check if current day has border', () => {
    component.day = new Date();

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(window.getComputedStyle(compiled, ':after').borderColor).toEqual('rgb(225, 29, 72)');
  });

  it('check if current day has border and is selected', () => {
    const date = removeTime(new Date());
    component.day = date;

    spyOnProperty(selector, 'from').and.returnValue(date);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(window.getComputedStyle(compiled).backgroundColor).toEqual('rgb(255, 158, 27)');
    expect(window.getComputedStyle(compiled, ':after').borderColor).toEqual('rgb(225, 29, 72)');
  });

  it('check if day is first', () => {
    const date = new Date();

    const from = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 3);
    const to = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    component.day = from;

    spyOnProperty(selector, 'from').and.returnValue(from);
    spyOnProperty(selector, 'to').and.returnValue(to);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(window.getComputedStyle(compiled).borderRadius).toEqual('4px 0px 0px 4px');
  });

  it('check if day is last', () => {
    const date = new Date();

    const from = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 3);
    const to = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    component.day = to;

    spyOnProperty(selector, 'from').and.returnValue(from);
    spyOnProperty(selector, 'to').and.returnValue(to);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(window.getComputedStyle(compiled).borderRadius).toEqual('0px 4px 4px 0px');
  });

  it('check if day is in the middle', () => {
    const date = new Date();

    const from = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 3);
    const middle = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 2);
    const to = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    component.day = middle;

    spyOnProperty(selector, 'from').and.returnValue(from);
    spyOnProperty(selector, 'to').and.returnValue(to);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(window.getComputedStyle(compiled).borderRadius).toEqual('0px');
  });

  it('check if is only one', () => {
    const date = new Date();

    component.day = date;

    spyOnProperty(selector, 'from').and.returnValue(date);
    spyOnProperty(selector, 'to').and.returnValue(date);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(window.getComputedStyle(compiled).borderRadius).toEqual('4px');
  });

  it('check if is only one and only from selected', () => {
    const date = removeTime(new Date());

    component.day = date;

    spyOnProperty(selector, 'from').and.returnValue(date);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(window.getComputedStyle(compiled).borderRadius).toEqual('4px');
    expect(window.getComputedStyle(compiled).backgroundColor).toEqual('rgb(255, 158, 27)');
  });

  it('check if is only one and only to selected', () => {
    const date = removeTime(new Date());

    component.day = date;

    spyOnProperty(selector, 'to').and.returnValue(date);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(window.getComputedStyle(compiled).borderRadius).toEqual('4px');
  });

  it('check click on empty day', () => {
    component.day = null;
    fixture.detectChanges();

    expect(fixture.componentInstance.select()).toEqual(undefined);
  });

  it('check click on disabled', () => {
    const date = new Date();
    component.day = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    fixture.detectChanges();

    expect(fixture.componentInstance.select()).toEqual(undefined);
  });

  it('check click', () => {
    component.day = new Date();
    spyOn(selector, 'select');

    fixture.detectChanges();

    fixture.componentInstance.select();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(selector.select).toHaveBeenCalled();
  });

  it('detect changes', () => {
    // This is a unique instance here, brand new
    const changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);

    // So, I am spying directly on the prototype.
    const markForCheckSpy = spyOn(changeDetectorRef.constructor.prototype, 'markForCheck');

    fixture.detectChanges();

    selector.select(new Date());

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(markForCheckSpy).toHaveBeenCalled();
  });

  it('detect changes do not call', () => {
    // This is a unique instance here, brand new
    const changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);

    // So, I am spying directly on the prototype.
    const markForCheckSpy = spyOn(changeDetectorRef.constructor.prototype, 'markForCheck');

    fixture.detectChanges();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(markForCheckSpy).not.toHaveBeenCalled();
  });
});
