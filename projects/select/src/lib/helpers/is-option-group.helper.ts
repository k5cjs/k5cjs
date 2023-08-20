import { KcGroup, OptionGroup } from '../types';

export const isOptionGroup = <V, K, L>(
  option: KcGroup<V, K, L> | OptionGroup<V, K, L>,
): option is OptionGroup<V, K, L> => !!option.value;
