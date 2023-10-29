import { inject } from '@angular/core';
import { Observable, filter, first, map, switchMap } from 'rxjs';

import { AtLeastDeep, isNotUndefined } from '@k5cjs/types';
import { Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { sha1 } from 'object-hash';

import { ActionsBase } from './store.actions';
import { SelectorsBase } from './store.selectors';
import { ActionAllOptions, ActionCreatorType, ByQueryParams } from './store.type';

export class StoreServiceBase<T extends { id: PropertyKey }> {
  all: Observable<T[]>;
  loadings: Observable<Record<PropertyKey, boolean | undefined>>;
  entities: Observable<Record<T['id'], T | undefined>>;
  queries: Observable<Record<PropertyKey, { ids: T['id'][] } | undefined>>;
  errors: Observable<Record<PropertyKey, string | undefined>>;

  protected _store = inject(Store<T>);
  protected _actions$ = inject(Actions);

  constructor(protected _actions: ActionsBase<T>, protected _selectors: SelectorsBase<T>) {
    this.all = this._store.select(this._selectors.all);
    this.loadings = this._store.select(this._selectors.loadings);
    this.entities = this._store.select(this._selectors.entities);
    this.queries = this._store.select(this._selectors.queries);
    this.errors = this._store.select(this._selectors.errors);
  }

  getByQuery(
    params: ByQueryParams,
    options: ActionAllOptions['options'] = {},
  ): Observable<{ items: T[] } & Record<PropertyKey, unknown>> {
    const query = this._query(params);

    return this._dispatch(
      this._actions.getByQuery({
        query,
        params,
        options: {
          init: { identified: this._actions.getByQuery.type },
          success: { reloadSelectors: true },
          ...options,
        },
      }),
      this._actions.getByQuerySuccess,
      this._actions.getByQueryIsLoaded,
      this._actions.getByQueryError,
    ).pipe(
      switchMap(() => this._store.select(this._selectors.queryAll(query))),
      filter(isNotUndefined),
    );
  }

  getById(
    params: { id: T['id'] } & Record<PropertyKey, unknown>,
    options: ActionAllOptions['options'] = {},
  ): Observable<{ item: T }> {
    const query = this._query(params);

    return this._dispatch(
      this._actions.getById({ query, params, options }),
      this._actions.getByIdSuccess,
      this._actions.getByIdIsLoaded,
      this._actions.getByIdError,
    ).pipe(
      switchMap(() => this._store.select(this._selectors.queryOne(query))),
      filter(isNotUndefined),
    );
  }

  create(item: Omit<T, 'id'>): Observable<{ item: T }> {
    const query = this._query(item);

    return this._dispatch(
      this._actions.create({
        query,
        params: { item },
        options: { success: { resetQueries: true, reloadIdentifiers: true } },
      }),
      this._actions.createSuccess,
      this._actions.createError,
    ).pipe(
      switchMap(() => this._store.select(this._selectors.queryOne(query))),
      filter(isNotUndefined),
    );
  }

  set(items: T[], options: ActionAllOptions['options'] = {}): Observable<{ items: T[] }> {
    const query = this._query({ items });

    return this._dispatch(
      this._actions.set({
        query,
        params: { items },
        options: { success: { resetQueries: true, reloadIdentifiers: true } },
      }),
      this._actions.setSuccess,
    ).pipe(
      switchMap(() => this._store.select(this._selectors.queryAll(query))),
      filter(isNotUndefined),
    );
  }

  update(item: AtLeastDeep<T, 'id'>, options: ActionAllOptions['options'] = {}): Observable<{ item: T }> {
    const query = this._query(item);

    return this._dispatch(
      this._actions.update({ query, params: { item }, options: { success: { reloadSelectors: true }, ...options } }),
      this._actions.updateSuccess,
      this._actions.updateError,
    ).pipe(
      switchMap(() => this._store.select(this._selectors.queryOne(query))),
      filter(isNotUndefined),
    );
  }

  delete(
    params: { id: T['id'] } & Record<PropertyKey, unknown>,
    options: ActionAllOptions['options'] = {},
  ): Observable<boolean> {
    const query = this._query(params);

    return this._dispatch(
      this._actions.delete({
        query,
        params,
        options: { success: { resetQueries: true, reloadSelectors: true }, ...options },
      }),
      this._actions.deleteSuccess,
      this._actions.deleteError,
    );
  }

  byQuery(params: ByQueryParams): Observable<{ items: T[] } & object> {
    const query = this._query(params);

    return this._store.select(this._selectors.queryAll(query)).pipe(filter(isNotUndefined));
  }

  byId(id: T['id']): Observable<T | undefined> {
    return this._store.select(this._selectors.entity(id));
  }

  error(params: ByQueryParams): Observable<string | undefined> {
    const query = this._query(params);

    return this._store.select(this._selectors.error(query));
  }

  protected _dispatch(
    action: Action,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...finishedActions: ActionCreatorType<object, any>[]
  ): Observable<boolean> {
    setTimeout(() => this._store.dispatch(action));

    return this._actions$.pipe(
      ofType(...finishedActions),
      // check is success action
      map(({ type }) => type === finishedActions[0].type),
      first(),
    );
  }

  protected _query(param: Record<PropertyKey, unknown>): string {
    return sha1(param);
  }
}
