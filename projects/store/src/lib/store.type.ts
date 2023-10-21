import { EntityState } from '@ngrx/entity';
import { Action, ActionCreator, NotAllowedCheck } from '@ngrx/store';

export interface StateBase<T extends { id: PropertyKey }> extends EntityState<T> {
  errors: Record<PropertyKey, string | undefined>;
  loadings: Record<PropertyKey, boolean | undefined>;
  queries: Record<PropertyKey, ({ ids: T['id'][] } & Record<PropertyKey, unknown>) | undefined>;
  reloadSelectors: number;
}

export interface ActionInit {
  identified?: PropertyKey;
}

export interface ActionSuccess {
  resetQueries?: boolean;
  reloadIdentifiers?: boolean;
  reloadSelectors?: boolean;

  before?: () => void;
  after?: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ActionSkip {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ActionError {}

export type ActionAllOptions<P = object, R = object, E = string> = {
  query: string;
  options?: {
    init?: ActionInit;
    success?: ActionSuccess;
    skip?: ActionSkip;
    error?: ActionError;
  };
} & (P extends object ? { params: P } : object) &
  (R extends object ? { response: R } : object) &
  (E extends string ? { error: E } : object);

export type ActionCreatorType<
  K extends { params?: object; response?: object; error?: string } = object,
  T extends ActionAllOptions<K['params'], K['response'], K['error']> = ActionAllOptions<
    K['params'],
    K['response'],
    K['error']
  >,
> = ActionCreator<string, (props: T & NotAllowedCheck<T>) => T & Action>;
