import { inject } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, filter, first, identity, map, switchMap } from 'rxjs';

import { AtLeastDeep, isNotUndefined } from '@k5cjs/types';
import { Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { sha1 } from 'object-hash';

import { ActionsBase } from './store.actions';
import { SelectorsBase } from './store.selectors';
import { ActionCreatorType, Options, Params } from './store.type';

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

  static First<K>(options: Options): MonoTypeOperatorFunction<K> {
    return options.first ? first() : identity;
  }

  getByQuery(options: Options<Params>): Observable<{ items: T[] } & Record<PropertyKey, unknown>> {
    const query = this._query({ params: options.params });

    return this._dispatch(
      this._actions.getByQuery({
        query,
        identified: this._actions.getByQuery.type,
        reloadSelectors: true,
        ...options,
      }),
      this._actions.getByQuerySuccess,
      this._actions.getByQueryIsLoaded,
      this._actions.getByQueryError,
    ).pipe(
      switchMap(() => this._store.select(this._selectors.queryAll(query))),
      filter(isNotUndefined),
      StoreServiceBase.First(options),
    );
  }

  getById(options: Options<{ item: Pick<T, 'id'> } & Params>): Observable<{ item: T }> {
    const query = this._query({ params: options.params });

    return this._dispatch(
      this._actions.getById({
        query,
        ...options,
      }),
      this._actions.getByIdSuccess,
      this._actions.getByIdIsLoaded,
      this._actions.getByIdError,
    ).pipe(
      switchMap(() => this._store.select(this._selectors.queryOne(query))),
      filter(isNotUndefined),
      StoreServiceBase.First(options),
    );
  }

  create(options: Options<{ item: Omit<T, 'id'> } & Params>): Observable<{ item: T }> {
    const query = this._query({ params: options.params });

    return this._dispatch(
      this._actions.create({
        query,
        resetQueries: true,
        reloadIdentifiers: true,
        ...options,
      }),
      this._actions.createSuccess,
      this._actions.createError,
    ).pipe(
      switchMap(() => this._store.select(this._selectors.queryOne(query))),
      filter(isNotUndefined),
      StoreServiceBase.First(options),
    );
  }

  set(options: Options<{ items: T[] } & Params>): Observable<{ items: T[] }> {
    const query = this._query({ params: options.params });

    return this._dispatch(
      this._actions.set({
        query,
        resetQueries: true,
        reloadIdentifiers: true,
        ...options,
      }),
      this._actions.setSuccess,
    ).pipe(
      switchMap(() => this._store.select(this._selectors.queryAll(query))),
      filter(isNotUndefined),
      StoreServiceBase.First(options),
    );
  }

  update(options: Options<{ item: AtLeastDeep<T, 'id'> } & Params>): Observable<{ item: T }> {
    const query = this._query({ params: options.params });

    return this._dispatch(
      this._actions.update({
        query,
        reloadSelectors: true,
        ...options,
      }),
      this._actions.updateSuccess,
      this._actions.updateError,
    ).pipe(
      switchMap(() => this._store.select(this._selectors.queryOne(query))),
      filter(isNotUndefined),
      StoreServiceBase.First(options),
    );
  }

  delete(options: Options<{ item: Pick<T, 'id'> } & Params>): Observable<boolean> {
    const query = this._query({ params: options.params });

    return this._dispatch(
      this._actions.delete({
        query,
        resetQueries: true,
        reloadSelectors: true,
        ...options,
      }),
      this._actions.deleteSuccess,
      this._actions.deleteError,
    ).pipe(StoreServiceBase.First(options));
  }

  byQuery(params: Params): Observable<{ items: T[] } & object> {
    const query = this._query({ params });

    return this._store.select(this._selectors.queryAll(query)).pipe(filter(isNotUndefined));
  }

  loading(params: Params): Observable<boolean | undefined> {
    const query = this._query({ params });

    return this._store.select(this._selectors.loading(query));
  }

  byId(id: T['id']): Observable<T | undefined> {
    return this._store.select(this._selectors.entity(id));
  }

  error(params: Params): Observable<string | undefined> {
    const query = this._query(params);

    return this._store.select(this._selectors.error(query));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected _dispatch(action: Action, ...finishedActions: ActionCreatorType<any>[]): Observable<boolean> {
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
