import { Observable } from 'rxjs';

export const enum Selector {
  From,
  To,
}

export interface KcCalBaseRange {
  from: Date | null;
  to: Date | null;
}

export interface KcCalBaseSelector<T> {
  select(date: Date): void;
  isSelected(date: Date): boolean;
  changed: Observable<T>;
  from: Date | null;
  to: Date | null;
}
