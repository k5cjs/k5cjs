import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  MonoTypeOperatorFunction,
  Observable,
  catchError,
  filter,
  first,
  identity,
  map,
  switchMap,
  throwError,
} from 'rxjs';

import { AtLeastDeep, isNotUndefined } from '@k5cjs/types';
import { Actions, ofType } from '@ngrx/effects';
import { IdSelector } from '@ngrx/entity';
import { Action, Store } from '@ngrx/store';
import { sha1 } from 'object-hash';

import { ActionsBase } from './store.actions';
import { SelectorsBase } from './store.selectors';
import { ActionCreatorType, Options, Params } from './store.type';

export class StoreServiceBase<T extends { id: PropertyKey }> {
  all: Observable<T[]>;
  loadings: Observable<Record<PropertyKey, boolean | undefined>>;
  entities: Observable<Record<ReturnType<IdSelector<T>>, T | undefined>>;
  queries: Observable<Record<PropertyKey, { ids: ReturnType<IdSelector<T>>[] } | undefined>>;
  errors: Observable<Record<PropertyKey, HttpErrorResponse | undefined>>;

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

  getByQuery(options: Options<Params>): Observable<{ items: T[] } & Params> {
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
      catchError(() => this._throwError(query)),
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
      catchError(() => this._throwError(query)),
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
      catchError(() => this._throwError(query)),
      switchMap(() => this._store.select(this._selectors.queryOne(query))),
      filter(isNotUndefined),
      StoreServiceBase.First(options),
    );
  }

  set(options: Options<{ items: T[] } & { query?: Params } & Params>): Observable<{ items: T[] }> {
    const query = this._query({ params: options.params.query || options.params });

    return this._dispatch(
      this._actions.set({
        query,
        resetQueries: true,
        reloadIdentifiers: true,
        ...options,
      }),
      this._actions.setSuccess,
      [],
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
      catchError(() => this._throwError(query)),
      switchMap(() => this._store.select(this._selectors.queryOne(query))),
      filter(isNotUndefined),
      StoreServiceBase.First(options),
    );
  }

  updateAll(options: Options<{ items: AtLeastDeep<T, 'id'>[] } & Params>): Observable<{ items: T[] }> {
    const query = this._query({ params: options.params });

    return this._dispatch(
      this._actions.updateAll({
        query,
        reloadSelectors: true,
        ...options,
      }),
      this._actions.updateAllSuccess,
      this._actions.updateAllError,
    ).pipe(
      catchError(() => this._throwError(query)),
      switchMap(() => this._store.select(this._selectors.queryAll(query))),
      filter(isNotUndefined),
      StoreServiceBase.First(options),
    );
  }

  delete(options: Options<{ item: Pick<T, 'id'> } & Params>): Observable<undefined> {
    const query = this._query({ params: options.params });

    return this._dispatch(
      this._actions.delete({
        query,
        resetQueries: true,
        reloadIdentifiers: true,
        ...options,
      }),
      this._actions.deleteSuccess,
      this._actions.deleteError,
    ).pipe(
      catchError(() => this._throwError(query)),
      map(() => undefined),
      StoreServiceBase.First(options),
    );
  }

  byQuery(params: Params): Observable<{ items: T[] } & object> {
    const query = this._query({ params });

    return this._store.select(this._selectors.queryAll(query)).pipe(filter(isNotUndefined));
  }

  loading(params: Params): Observable<boolean | undefined> {
    const query = this._query({ params });

    return this._store.select(this._selectors.loading(query));
  }

  byId(item: Partial<T>): Observable<T | undefined>;
  /**
   * @deprecated use with item
   */
  byId(id: T['id']): Observable<T | undefined>;
  byId(item: T['id'] | Partial<T>): Observable<T | undefined> {
    /**
     * remove this in next major version
     */
    const options: Partial<T> = this._isPartialT(item) ? item : ({ id: item } as Partial<T>);

    return this._store.select(this._selectors.entity(options));
  }

  error(params: Params): Observable<HttpErrorResponse | undefined> {
    const query = this._query(params);

    return this._errorByQuery(query);
  }

  protected _throwError(query: string): Observable<never> {
    return this._errorByQuery(query).pipe(switchMap((error) => throwError(() => error)));
  }

  protected _errorByQuery(query: string): Observable<HttpErrorResponse | undefined> {
    return this._store.select(this._selectors.error(query));
  }
  /**
   * if you have finished actions and do not have an error finished action, then call function like this:
   * this._dispatch(action, successAction, [])
   */
  protected _dispatch(
    action: Action,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...finishedActions: [...ActionCreatorType<any>[], ActionCreatorType<any>[]]
  ): Observable<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected _dispatch(action: Action, ...finishedActions: ActionCreatorType<any>[]): Observable<string>;
  protected _dispatch(
    action: Action,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...finishedActions: [...ActionCreatorType<any>[], ActionCreatorType<any>[]] | ActionCreatorType<any>[]
  ): Observable<string> {
    setTimeout(() => this._store.dispatch(action));

    const errorsActions = finishedActions[finishedActions.length - 1];
    const errors = Array.isArray(errorsActions) ? errorsActions : [errorsActions];

    return this._actions$.pipe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ofType<ActionCreatorType<any>>(...finishedActions.flat()),
      map(({ type }) => {
        if (errors.some((error) => error.type === type)) {
          throw new Error(type);
        }

        return type;
      }),
      first(),
    );
  }

  protected _query(param: Record<PropertyKey, unknown>): string {
    return sha1(param);
  }

  private _isPartialT(item: unknown): item is Partial<T> {
    return item instanceof Object;
  }
}
