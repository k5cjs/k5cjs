import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { POSITIONS } from '../../config';
import { KcDropdownOptionsDirective } from '../../directives/dropdown.directive';

@Component({
  selector: 'kc-internal-dropdown',
  templateUrl: './internal-dropdown.component.html',
  styleUrls: ['./internal-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcInternalDropdownComponent implements OnDestroy {
  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;
  @ViewChild('icon') icon!: ElementRef<HTMLElement>;
  @ContentChild(KcDropdownOptionsDirective) options!: KcDropdownOptionsDirective;

  private _dialogOverlayRef: OverlayRef | undefined;

  cdkOverlayConfig = {
    hasBackdrop: false,
    disposeOnNavigation: true,
  };

  @Output() dialogClosed = new EventEmitter<void>();

  constructor(private _overlay: Overlay) {}

  ngOnDestroy(): void {
    this.container.clear();
  }

  open(): void {
    this._openDialog();
  }

  close() {
    this._closeDialog();
  }

  private _openDialog(): void {
    const overlayRef = this._overlay.create({
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      positionStrategy: this._overlay
        .position()
        .flexibleConnectedTo(this.icon)
        .withPositions(POSITIONS)
        .withPush(false),
      ...this.cdkOverlayConfig,
    });

    const dialogPortal = new TemplatePortal(this.options.template, this.container);
    overlayRef.attach(dialogPortal);

    this._dialogOverlayRef = overlayRef;

    overlayRef.outsidePointerEvents().subscribe((event: MouseEvent) => {
      const pane = (event.target as HTMLElement)?.closest('.cdk-overlay-pane');
      if (pane && overlayRef.overlayElement.contains(pane)) return;
      this._closeDialog();
    });

    this._repositionOnScroll(overlayRef);
  }

  private _repositionOnScroll(overlayRef: OverlayRef): void {
    const onScroll = () => overlayRef.updatePosition();
    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    overlayRef.detachments().subscribe(() => window.removeEventListener('scroll', onScroll, true));

    const origin: HTMLElement = this.icon.nativeElement;
    const scrollParent = this._getScrollParent(origin);
    if (!scrollParent) return;

    const observer = new IntersectionObserver(([entry]) => !entry.isIntersecting && this._closeDialog(), {
      root: scrollParent,
    });
    observer.observe(origin);
    overlayRef.detachments().subscribe(() => observer.disconnect());
  }

  private _getScrollParent(node: HTMLElement): HTMLElement | null {
    for (let el = node.parentElement; el; el = el.parentElement) {
      const { overflowX, overflowY } = getComputedStyle(el);
      if (/(auto|scroll|hidden)/.test(overflowX + overflowY)) return el;
    }
    return null;
  }

  private _closeDialog(): void {
    this.dialogClosed.emit();

    this._dialogOverlayRef?.dispose();
    this._dialogOverlayRef = undefined;
  }
}
