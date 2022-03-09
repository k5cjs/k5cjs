import { NumberInput, coerceNumberProperty } from '@angular/cdk/coercion';
import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[k5cDisablePointerOnScroll]',
})
export class DisablePointerOnScrollDirective {
  @Input()
  set k5cDisablePointerOnScroll(value: NumberInput) {
    this._disablePointerOnScroll = coerceNumberProperty(value, 150);
  }
  get k5cDisablePointerOnScroll(): number {
    return this._disablePointerOnScroll;
  }
  private _disablePointerOnScroll!: number;

  @Output() scrollPosition: EventEmitter<number> = new EventEmitter<number>();

  private _timer!: ReturnType<typeof setTimeout>;

  constructor(private _el: ElementRef<HTMLElement>, private _renderer: Renderer2) {}

  @HostListener('scroll', ['$event']) onclick = () => {
    this.scrollPosition.emit(this._el.nativeElement.scrollTop);

    clearTimeout(this._timer);

    this._renderer.addClass(this._el.nativeElement, 'k5c-disable-pointer-on-scroll');

    this._timer = setTimeout(
      () => this._renderer.removeClass(this._el.nativeElement, 'k5c-disable-pointer-on-scroll'),
      this.k5cDisablePointerOnScroll,
    );
  };
}
