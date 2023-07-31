import { Directive, OnDestroy, ViewContainerRef } from '@angular/core';

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[kcCalWeekOutlet]' })
export class KcCalWeekOutletDirective implements OnDestroy {
  static mostRecentCellOutlet: KcCalWeekOutletDirective | null = null;

  constructor(public _viewContainer: ViewContainerRef) {
    KcCalWeekOutletDirective.mostRecentCellOutlet = this;
  }

  ngOnDestroy(): void {
    // If this was the last outlet being rendered in the view, remove the reference
    // from the static property after it has been destroyed to avoid leaking memory.
    if (KcCalWeekOutletDirective.mostRecentCellOutlet === this) {
      KcCalWeekOutletDirective.mostRecentCellOutlet = null;
    }
  }
}
