import { KcOptionGroupValue, KcOptionValue } from '../types';

export const isOptionGroupValue = <V>(
  option: KcOptionValue<V> | KcOptionGroupValue<V>,
): option is KcOptionGroupValue<V> => typeof option === 'object' && option !== null && !Array.isArray(option);
