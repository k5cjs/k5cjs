export interface KcToggleItemContext<T> {
  $implicit: KcToggleOptions<T>;
  selected: boolean;
}

export interface KcToggleOptions<T> {
  value: T;
  label: string;
}
