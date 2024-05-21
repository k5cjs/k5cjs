/**
 * options type for input options
 */
// TODO: move K to be second generic and put default to unknown

import { MapEmitSelect } from '../helpers';

// because key is optional
export interface KcOption<V, K = V, L = string> {
  value: V;
  key?: K;
  label?: L;
  compareFn?: (selectedOption: V | KcOptionGroupValue<V>, currentOption: V) => boolean;
}

export type KcGroup<V, K = V, L = string> = {
  [K: string]: KcGroup<V, K, L> | OptionGroup<V, K, L>;
};

export interface OptionGroup<V, K = V, L = string> {
  value: KcOption<V, K, L>[] | KcOption<V, K, L>[][];
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
export type KcOptionSelection<V, K, L> = MapEmitSelect<
  KcOption<V, K, L> | KcOptionSelection<V, K, L>,
  string | V | K,
  boolean
>;
