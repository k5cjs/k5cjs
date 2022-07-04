import { CdkOverlayOrigin, Overlay, OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { KcSelectComponent } from './kc-select.component';

describe('KcSelectComponent', () => {
  let component: KcSelectComponent;
  let fixture: ComponentFixture<KcSelectComponent>;

  let componentRoot: RootComponent;
  let fixtureRoot: ComponentFixture<RootComponent>;

  let overlay: Overlay;
  let overlayContainerElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KcSelectComponent, RootComponent],
      imports: [OverlayModule, FormsModule, ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KcSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixtureRoot = TestBed.createComponent(RootComponent);
    componentRoot = fixtureRoot.componentInstance;
    fixtureRoot.detectChanges();
  });

  beforeEach(inject([OverlayContainer, Overlay], (oc: OverlayContainer, o: Overlay) => {
    overlay = o;
    overlayContainerElement = oc.getContainerElement();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check panel open', () => {
    component.open();
    expect(component.panelOpen).toBeTruthy();
  });

  it('check dialog open', () => {
    component.dialog = true;
    component.open();
    expect(component.panelOpen).toBeFalsy();
    expect(component.selectionOpened).toBeTruthy();
  });

  it('check onChange before change by registerOnChange', () => {
    fixture = TestBed.createComponent(KcSelectComponent);
    component = fixture.componentInstance;
    expect(component.onChange()).toBeUndefined();
  });

  it('check OnTouched before change by registerOnTouched', () => {
    fixture = TestBed.createComponent(KcSelectComponent);
    component = fixture.componentInstance;
    expect(component.onTouch()).toBeUndefined();
  });

  it('check panel opened in template', () => {
    fixtureRoot.debugElement.queryAll(By.directive(CdkOverlayOrigin))[0].nativeElement.click();
    fixtureRoot.detectChanges();

    expect(overlayContainerElement.textContent).toEqual('Overlay');
  });

  it('check panel closed in template', () => {
    fixtureRoot.debugElement.queryAll(By.directive(CdkOverlayOrigin))[0].nativeElement.click();
    fixtureRoot.detectChanges();

    expect(overlayContainerElement.textContent).toEqual('Overlay');

    const backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;
    backdrop.click();
    fixtureRoot.detectChanges();

    expect(overlayContainerElement.textContent).toEqual('');
  });

  it('check dialog opened in template', () => {
    fixtureRoot.debugElement.queryAll(By.directive(CdkOverlayOrigin))[1].nativeElement.click();
    fixtureRoot.detectChanges();

    expect(overlayContainerElement.textContent).toEqual('Dialog');
  });

  it('check dialog closed in template', () => {
    fixtureRoot.debugElement.queryAll(By.directive(CdkOverlayOrigin))[1].nativeElement.click();
    fixtureRoot.detectChanges();

    expect(overlayContainerElement.textContent).toEqual('Dialog');

    const backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;
    backdrop.click();
    fixtureRoot.detectChanges();

    expect(overlayContainerElement.textContent).toEqual('');
  });

  it('check control value', () => {
    const controlElement = fixtureRoot.debugElement.queryAll(By.directive(CdkOverlayOrigin))[2].nativeElement;
    expect(controlElement.textContent).toContain('control');
  });

  it('check input dialog true', () => {
    const autocomplete = fixtureRoot.debugElement.queryAll(By.directive(CdkOverlayOrigin))[1]
      .componentInstance as KcSelectComponent;
    expect(autocomplete.dialog).toBeTrue();
  });

  it('check input dialog false', () => {
    const autocomplete = fixtureRoot.debugElement.queryAll(By.directive(CdkOverlayOrigin))[0]
      .componentInstance as KcSelectComponent;
    expect(autocomplete.dialog).toBeFalsy();
  });
});

@Component({
  selector: 'kc-root',
  template: `
    <autocomplete>Overlay</autocomplete>
    <autocomplete dialog>Dialog</autocomplete>
    <autocomplete [formControl]="control">Dialog</autocomplete>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class RootComponent {
  control = new FormControl('control');
}
