import { KcGroup, KcOption } from '../types';

export const isOptionChunks = <V, K, L>(
  option: KcOption<V, K, L>[] | KcOption<V, K, L>[][] | KcGroup<V, K, L>,
): option is KcOption<V, K, L>[][] => Array.isArray(option) && Array.isArray(option[0]);
