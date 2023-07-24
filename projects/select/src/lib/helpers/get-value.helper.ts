import { KcOption, KcOptionGroupValue, KcOptionSelection, KcOptionValue } from '../types';

import { MapEmitSelect } from './map-emit-select.helpers';

type Options<V, K, L> = KcOptionSelection<V, K, L> | KcOption<V, K, L>;
type OptionsValue<V> = KcOptionGroupValue<V> | KcOptionValue<V>;
type Item<V, K, L> = [K | V, Options<V, K, L>];

export function getValues<V, K, L>(values: KcOptionSelection<V, K, L>): OptionsValue<V> | undefined {
  /**
   * check if map is multiple
   * is is multiple we need to iterate over all values
   */
  if (values.isMultiple()) {
    return (values.selectedEntries as unknown as Item<V, K, L>[]).reduce<OptionsValue<V> | undefined>(
      (acc, [key, item]) => {
        if (checkIsOption(item)) return [...(acc as []), item.value];
        /**
         * check if accumulator is an array that means is the first iteration
         * when we have a nested group we change the accumulator to an object
         */
        if (Array.isArray(acc)) acc = {};
        /**
         * get value from nested group
         */
        const value = getValues(item);
        /**
         * when the group has no value we return the accumulator
         */
        if (checkIsEmpty(value)) return acc;

        return {
          ...acc,
          [key as unknown as string]: value,
        };
      },
      [],
    );
  }

  if (!values.selectedEntries) return;

  const [key, item] = values.selectedEntries as Item<V, K, L>;

  if (checkIsOption(item)) return item.value;

  const value = getValues(item);

  if (checkIsEmpty(value)) return;

  return { [key as unknown as string]: value };
}

// eslint-disable-next-line @typescript-eslint/ban-types
function checkIsEmpty<V>(item: OptionsValue<V> | undefined): item is undefined | [] | {} {
  /**
   * check if items is undefined
   */
  if (item === undefined) return true;
  /**
   * check if object is empty
   */
  if (typeof item === 'object' && Object.keys(item || {}).length === 0) return true;
  /**
   * check if array and is empty
   */
  if (Array.isArray(item) && item.length === 0) return true;

  return false;
}

function checkIsOption<V, K, L>(item: Options<V, K, L>): item is KcOption<V, K, L> {
  return !(item instanceof MapEmitSelect);
}
