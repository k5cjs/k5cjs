import { KcGroup, KcOption, OptionGroup } from '../types';

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
      if (isOptionObject(item))
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

export function isOptionChunks(
  option: KcOption<string, string>[] | KcOption<string, string>[][] | KcGroup<string, string>,
): option is KcOption<string, string>[][] {
  return Array.isArray(option) && Array.isArray(option[0]);
}

export function isOptionObject(
  option: KcGroup<string, string> | OptionGroup<string, string>,
): option is OptionGroup<string, string> {
  return !!option.value;
}
