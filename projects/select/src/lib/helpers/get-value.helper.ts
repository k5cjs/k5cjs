import { MapEmit } from '@k5cjs/selection-model';

import { KcOption, KcOptionGroupValue, KcOptionSelection, KcOptionValue } from '../types';

type Options<K, V> = KcOptionSelection<K, V> | KcOption<K, V>;
type OptionsValue<V> = KcOptionGroupValue<V> | KcOptionValue<V>;
type Item<K, V> = [K | V, Options<K, V>];

export function getValues<K, V>(values: KcOptionSelection<K, V>): OptionsValue<V> | undefined {
  /**
   * check if map is multiple
   * is is multiple we need to iterate over all values
   */
  if (values.isMultiple()) {
    return (values.selectedEntries as unknown as Item<K, V>[]).reduce<OptionsValue<V> | undefined>(
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

  const [key, item] = values.selectedEntries as Item<K, V>;

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
  if (!item) return true;
  /**
   * check if array or object and is empty
   */
  if (!Object.keys(item).length) return true;

  return false;
}

function checkIsOption<K, V>(item: Options<K, V>): item is KcOption<K, V> {
  return !(item instanceof MapEmit);
}
