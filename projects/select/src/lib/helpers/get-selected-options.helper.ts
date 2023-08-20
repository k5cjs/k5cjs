import { KcGroup, KcOption, KcOptionGroupValue, KcOptionValue } from '../types';

import { isOptionChunks } from './is-option-chunks.helper';
import { isOptionGroupValue } from './is-option-group-value.helper';
import { MapEmitSelect } from './map-emit-select.helpers';

type Options<V, K, L> = KcOption<V, K, L>[] | KcOption<V, K, L>[][] | KcGroup<V, K, L>;
type Value<V> = KcOptionValue<V> | KcOptionGroupValue<V>;

const simpleOptions = <V, K, L>(options: KcOption<V, K, L>[] | KcOption<V, K, L>[][], value: Value<V>) => {
  if (isOptionChunks(options)) {
    return options.flat().filter((option) => {
      if (Array.isArray(value))
        return value.some((value) => (option.key ? value === option.key : value === option.value));

      return option.key ? value === option.key : value === option.value;
    });
  } else {
    return options.filter((option) => {
      if (Array.isArray(value))
        return value.some((value) => (option.key ? value === option.key : value === option.value));

      return option.key ? value === option.key : value === option.value;
    });
  }
};

const groupOptions = <V, K, L>(
  options: KcGroup<V, K, L>,
  value: KcOptionGroupValue<V>,
): [K | V, KcOption<V, K, L>][] => {
  return (
    Object.entries(options)
      .filter(([key]) => value[key])
      .map(([key, { value }]) => {
        const allOptions = value as KcOption<V, K, L>[];
        const selectedValues = value as KcOptionGroupValue<V>;
        const selectedValue = selectedValues[key];

        const filter = allOptions.filter((option) => {
          if (Array.isArray(selectedValue))
            return selectedValue.some((value) => value === option.key || value === option.value);

          return selectedValue === option.key || selectedValue === option.value;
        });

        const selectedOptions: [K, V][] = filter.map((option) => [option.key || option.value, option]) as [K, V][];

        const group = Array.isArray(selectedValue)
          ? new MapEmitSelect<V, K, true>(true, selectedOptions as unknown as [K, V][])
          : new MapEmitSelect(false, selectedOptions[0]);

        return {
          key,
          value: group,
        };
      }) as unknown as KcOption<V, K, L>[]
  ).map((option) => [option.key || option.value, option.value as KcOption<V, K, L>]);
};

export const getSelectedOptions = <V, K, L>(
  options: Options<V, K, L>,
  value: Value<V>,
): [K | V, KcOption<V, K, L>][] | undefined => {
  if (Array.isArray(options)) {
    return simpleOptions(options, value).map((option) => [option.key || option.value, option]);
  } else if (options) {
    if (isOptionGroupValue(value)) return groupOptions(options, value);

    throw new Error('Value is not a group value');
  }

  return undefined;
};