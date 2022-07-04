import { Observable } from 'rxjs';

export interface KcSelect {
  allSelected: boolean;
  allSelectedChanged: Observable<boolean>;
  close: (event?: MouseEvent) => void;
  submit: () => void;
  selectAll: () => void;
  deselectAll: () => void;
  toggle: () => void;
  clear: () => void;
}
