import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';

import { KcOption } from '@k5cjs/select';

@Component({
  selector: 'app-virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualScrollComponent {
  control: FormControl;
  options: Observable<KcOption<string, string>[]>;
  loading = false;

  private _options: BehaviorSubject<KcOption<string, string>[]>;

  private _page = 50;
  private _buffer = 5;
  private _loaded: Set<number>;

  constructor(private _fb: FormBuilder, private _cdr: ChangeDetectorRef) {
    this.control = this._fb.control(null);

    this._options = new BehaviorSubject<KcOption<string, string>[]>([]);
    this.options = this._options.asObservable();

    this._loaded = new Set();

    this._fetchOptions(0);
  }

  indexChanged(index: number): void {
    if (this.loading) return;

    if (index % this._page >= this._page - this._buffer) {
      const skip = Math.ceil(index / this._page) * this._page;

      if (!this._loaded.has(skip)) this._fetchOptions(skip);

      this._loaded.add(skip);
    }
  }

  private _fetchOptions(skip: number): void {
    this.loading = true;

    setTimeout(() => {
      this._options.next([...this._options.value, ...this._generateOptions(this._page, skip)]);
      this.loading = false;
      this._cdr.detectChanges();
    }, 300);
  }

  private _generateOptions(length: number, skip: number = 0): KcOption<string, string>[] {
    return Array.from({ length }).map((_, i) => ({ label: `Location ${i + skip}`, value: `Location ${i + skip}` }));
  }
}
