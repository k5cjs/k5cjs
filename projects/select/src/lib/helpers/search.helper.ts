import { KcGroup, KcOption } from '../types';

import { isOptionChunks } from './is-option-chunks.helper';
import { isOptionGroup } from './is-option-group.helper';

export function filterNestedOptions(options: KcOption<string, string>[], search: string): KcOption<string, string>[];
export function filterNestedOptions(
  options: KcOption<string, string>[][],
  search: string,
): KcOption<string, string>[][];
export function filterNestedOptions(options: KcGroup<string, string>, search: string): KcGroup<string, string>;
export function filterNestedOptions(
  options: KcOption<string, string>[] | KcOption<string, string>[][] | KcGroup<string, string>,
  search: string,
): KcOption<string, string>[] | KcOption<string, string>[][] | KcGroup<string, string> {
  if (isOptionChunks(options)) return options.map((option) => filterNestedOptions(option, search));
  else if (Array.isArray(options))
    return options.filter((option) => option.label?.toLowerCase().includes(search.toLowerCase()));
  else {
    return Object.entries(options).reduce<KcGroup<string, string>>((acc, [key, item]) => {
      if (isOptionGroup(item))
        acc[key] = {
          ...item,
          value: isOptionChunks(item.value)
            ? filterNestedOptions(item.value, search)
            : filterNestedOptions(item.value, search),
        };
      else acc[key] = filterNestedOptions(item, search);

      return acc;
    }, {});
  }
}
