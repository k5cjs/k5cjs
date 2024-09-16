import { Directive, OnInit, inject } from '@angular/core';
import { GRID_TEMPLATE } from '../../tokens';
import { KcGridService } from '../../services';

@Directive({
  selector: '[kcGridScroll]',
  standalone: true,
})
export class ScrollDirective implements OnInit {
  private _grid = inject(KcGridService);
  private _gridTemplate = inject(GRID_TEMPLATE);

  ngOnInit(): void {
    this._scroll();
  }

  private _scroll(): void {
    this._gridTemplate.containerElementRef.nativeElement.addEventListener('wheel', (event) => {
      if (this._grid.isItemsMoving) event.preventDefault();
    });

    this._gridTemplate.containerElementRef.nativeElement.addEventListener('scroll', () => {
      if (this._grid.isItemsMoving) return;

      this._grid.scrollTop = this._gridTemplate.containerElementRef.nativeElement.scrollTop;
      this._grid.scrollLeft = this._gridTemplate.containerElementRef.nativeElement.scrollLeft;
    });
  }
}
