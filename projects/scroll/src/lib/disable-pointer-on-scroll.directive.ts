import { NumberInput, coerceNumberProperty } from '@angular/cdk/coercion';
import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

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

  constructor(private _el: ElementRef<HTMLElement>) {}

  @HostListener('scroll', ['$event']) onclick = () => {
    this.scrollPosition.emit(this._el.nativeElement.scrollTop);

    clearTimeout(this._timer);

    console.log('set to none');

    this._el.nativeElement.style.pointerEvents = 'none';

    this._timer = setTimeout(() => {
      this._el.nativeElement.style.pointerEvents = 'initial';
      console.log('remove', this.k5cDisablePointerOnScroll);
    }, this.k5cDisablePointerOnScroll);
  };
}
