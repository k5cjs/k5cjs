import { AfterViewInit, Directive, DoCheck, HostListener, OnDestroy, OnInit } from '@angular/core';

import { KcControl, kcControlProviders } from '@k5cjs/control';

@Directive({
  selector: 'textarea[kc-textarea]',
  providers: kcControlProviders(KcTextarea),
  standalone: true,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class KcTextarea
  extends KcControl<string, HTMLTextAreaElement>
  implements OnInit, AfterViewInit, DoCheck, OnDestroy
{
  errorState = false;

  ngDoCheck(): void {
    if (this.ngControl) {
      const oldState = this.errorState;
      const newState = this.invalid;
      if (newState !== oldState) {
        this.errorState = newState;
        this._stateChanges.next();
      }
    }
  }

  override ngAfterViewInit(): void {
    if (this._platform.isBrowser)
      this._autofillMonitor.monitor(this.elementRef.nativeElement).subscribe(() => this._stateChanges.next());
  }

  override ngOnDestroy(): void {
    this._stateChanges.complete();

    if (this._platform.isBrowser) this._autofillMonitor.stopMonitoring(this.elementRef.nativeElement);
  }

  @HostListener('focus', ['true'])
  @HostListener('blur', ['false'])
  protected _focusChanged(isFocused: boolean): void {
    if (isFocused !== this.focused) {
      this.focused = isFocused;
      this._stateChanges.next();
    }
  }
}
