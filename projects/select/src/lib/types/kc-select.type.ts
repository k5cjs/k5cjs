import { Observable } from 'rxjs';

import { KcOptionGroupValue, KcOptionValue } from './kc-option.type';

export interface KcSelect<V = unknown> {
  allSelected: boolean;
  allSelectedChanged: Observable<boolean>;
  multiple: boolean;
  focused: boolean;
  click: (event?: MouseEvent) => void;
  open: (event?: MouseEvent) => void;
  close: (event?: MouseEvent) => void;
  submit: () => void;
  selectAll: () => void;
  deselectAll: () => void;
  toggle: () => void;
  clear: () => void;

  get value(): KcOptionValue<V> | KcOptionGroupValue<V>;
}
