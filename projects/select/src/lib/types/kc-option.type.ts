import { MapEmit } from '@k5cjs/selection-model';

/**
 * options type for input options
 */
export interface KcOption<K, V> {
  value: V;
  key?: K;
  label?: string;
}

export type KcGroup<K, V> = {
  [K: string]: KcGroup<K, V> | OptionGroup<K, V>;
};

export interface OptionGroup<K, V> {
  value: KcOption<K, V>[] | KcOption<K, V>[][];
  label?: string;
}

/**
 * options type for output options
 */
export type KcOptionValue<V> = V | V[];

export type KcOptionGroupValue<V> = {
  [K: string]: KcOptionValue<V> | KcOptionGroupValue<V>;
};

/**
 * options for internal structure
 */
export type KcOptionSelection<K, V> = MapEmit<string | K | V, KcOption<K, V> | KcOptionSelection<K, V>, boolean>;
