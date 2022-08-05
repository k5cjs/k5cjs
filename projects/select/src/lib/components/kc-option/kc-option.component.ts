import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  Input,
  OnDestroy,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { MapEmit } from '@k5cjs/selection-model';

import { KC_SELECTION } from '../../tokens';
import { KcOption } from '../../types';

@Component({
  selector: 'kc-option',
  templateUrl: './kc-option.component.html',
  styleUrls: ['./kc-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcOptionComponent<K, V> implements OnDestroy {
  @Input() option!: KcOption<K | V, V>;

  private _destroy: Subject<void>;

  constructor(
    @Inject(KC_SELECTION) private _selection: MapEmit<K | V, KcOption<K | V, V>, boolean>,
    private _cdr: ChangeDetectorRef,
  ) {
    this._destroy = new Subject();

    this._selection.changed.pipe(takeUntil(this._destroy)).subscribe(() => this._cdr.markForCheck());
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  get selected(): boolean {
    return this._selection.has(this.option.key || this.option.value);
  }

  @HostListener('click')
  click(): void {
    console.log('super click');
    this.toggle();
  }

  toggle(): void {
    if (this._selection.has(this.option.key || this.option.value)) this.deselect();
    else this.select();
  }

  select(): void {
    this._selection.set(this.option.key || this.option.value, this.option);
  }

  deselect(): void {
    this._selection.delete(this.option.key || this.option.value);
  }
}
