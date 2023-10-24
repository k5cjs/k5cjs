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

export interface ActionOptions {
  init?: ActionInit;
  success?: ActionSuccess;
  skip?: ActionSkip;
  error?: ActionError;
}

export type ObjectParams<T = unknown> = Record<PropertyKey, T>;

export type ActionAllOptions<P = ObjectParams, R = ObjectParams, E = string> = {
  query: string;
  options?: ActionOptions;
} & (P extends ObjectParams ? { params: P } : ObjectParams) &
  (R extends ObjectParams ? { response: R } : ObjectParams) &
  (E extends string ? { error: E } : ObjectParams);

export type ActionCreatorType<
  K extends { params?: ObjectParams; response?: ObjectParams; error?: string } = ObjectParams,
  T extends ActionAllOptions<K['params'], K['response'], K['error']> = ActionAllOptions<
    K['params'],
    K['response'],
    K['error']
  >,
> = ActionCreator<string, (props: T & NotAllowedCheck<T>) => T & Action>;

export type ByQueryParams<T extends string | undefined = undefined> = (T extends undefined ? object : { url: T }) &
  ObjectParams<string | number | boolean>;
