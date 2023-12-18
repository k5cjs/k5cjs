import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EntityState } from '@ngrx/entity';
import { Action, ActionCreator, NotAllowedCheck } from '@ngrx/store';

export type Params<T = unknown> = Record<PropertyKey, T>;
export type HttpParams = Params<string | number | boolean>;

export interface StateBase<T extends { id: PropertyKey }> extends EntityState<T> {
  errors: Params<HttpErrorResponse | undefined>;
  loadings: Params<boolean | undefined>;
  queries: Params<({ ids: T['id'][] } & Params) | undefined>;
  reloadSelectors: number;
}

export type ActionCreatorType<T extends object> = ActionCreator<string, (props: T & NotAllowedCheck<T>) => T & Action>;

interface ActionBase {
  /**
   * identified is used to store a action and after that
   * to use in reload identifiers
   */
  identified?: PropertyKey;
  /**
   * remove all queries for example when you add a new item
   */
  resetQueries?: boolean;
  /**
   * reload identifiers
   * for example when you have a list and you add a new items
   * and you need to get the list again
   */
  reloadIdentifiers?: boolean;
  /**
   * reload selectors for example when update a item but
   * you have a list of items
   */
  reloadSelectors?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ActionInit<T extends Params = Params, U = any, R = any> extends ActionBase {
  query: string;
  params: T;
  url?: U;
  /**
   * callback before success action to allow user
   * to set differing store
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  beforeSuccess?: (response: R) => Observable<any>;
}

export interface ActionSuccess<T = Params> extends Pick<ActionBase, 'resetQueries' | 'reloadSelectors'> {
  query: string;
  params: T;
}

export interface ActionSkip<T = Params> {
  query: string;
  params: T;
}

export interface ActionError<T = Params> {
  query: string;
  params: T;
}

type CheckType<T, K> = unknown extends T ? object : K;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Options<T = any, U = any, R = any> = ActionBase & {
  /**
   * sugar syntax for first operator
   */
  first?: boolean;
} & CheckType<T, { params: T }> &
  CheckType<U, { url: U }> &
  /**
   * callback before success action to allow user
   * to set differing store
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CheckType<R, { beforeSuccess?: (response: R) => Observable<any> }>;
