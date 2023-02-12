import { MapEmit } from '@k5cjs/selection-model';

export class MapEmitSelect<V, K = V, T extends boolean = false> extends MapEmit<K, V, T> {
  constructor(multiple: T, initiallyValues?: T extends false ? [K, V] : [K, V][]) {
    super(multiple, initiallyValues);
  }

  get test(): T extends false ? V | null : V[] {
    const selected = super.selectedEntries;

    if (selected) {
      if (this._isUnion(selected)) return selected.map(([, value]) => value) as T extends false ? V | null : V[];
      else {
        const [k, value] = selected;
        const key: string = k as string;

        if (this._isMapEmitSelect(value)) return { [key]: value.selected } as T extends false ? V | null : V[];
        return { [key]: value } as T extends false ? V | null : V[];
      }
    }

    return selected as T extends false ? V | null : V[];
  }

  private _isMapEmitSelect(value: unknown): value is MapEmitSelect<V, K, T> {
    return value instanceof MapEmitSelect;
  }

  private _isUnion(value: [K, V] | [K, V][]): value is [K, V][] {
    return Array.isArray(value[0]);
  }
}
