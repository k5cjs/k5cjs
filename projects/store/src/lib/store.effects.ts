import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { type ObservableInput, catchError, concatMap, first, map, mergeMap, of, tap } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { ActionsBase } from './store.actions';
import { HttpServiceBase } from './store.http.service';
import { SelectorsBase } from './store.selectors';
import { ActionInit, ActionSuccess, Options, Params } from './store.type';

const createSuccessActionBody = <T extends Params = Params<string | number | boolean>>(
  params: T,
  { query, resetQueries, reloadSelectors }: ActionInit,
): ActionSuccess<T> => ({ query, reloadSelectors, resetQueries, params });

@Injectable()
export class EffectsBase<T extends { id: PropertyKey }> {
  protected _actions$ = inject(Actions);
  protected _store = inject(Store);

  protected identifiers: Record<PropertyKey, Options & Action> = {};

  getByQuery$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(this._actions.getByQuery),
      this._setIdentified(),
      concatLatestFrom(() => this._store.select(this._selectors.queries)),
      mergeMap(([action, queries]) =>
        queries[action.query]
          ? of(this._actions.getByQueryIsLoaded(action))
          : this._http.getByQuery(action).pipe(
              this._callBefore(action),
              concatMap((response) => [
                this._actions.getByQuerySuccess(createSuccessActionBody(response, action)),
                ...this._reloadIdentifiers(this._actions.getByQuerySuccess, action),
              ]),
              catchError((error: HttpErrorResponse) =>
                of(this._actions.getByQueryError({ query: action.query, params: { error } })),
              ),
            ),
      ),
    );
  });

  getById$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(this._actions.getById),
      this._setIdentified(),
      concatLatestFrom(() => this._store.select(this._selectors.queries)),
      mergeMap(([action, queries]) =>
        queries[action.query]
          ? of(this._actions.getByIdIsLoaded(action))
          : this._http.getById(action).pipe(
              this._callBefore(action),
              concatMap((response) => [
                this._actions.getByIdSuccess(createSuccessActionBody(response, action)),
                ...this._reloadIdentifiers(this._actions.getByIdSuccess, action),
              ]),
              catchError((error: HttpErrorResponse) =>
                of(this._actions.getByIdError({ query: action.query, params: { error } })),
              ),
            ),
      ),
    );
  });

  create$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(this._actions.create),
      this._setIdentified(),
      mergeMap((action) =>
        this._http.create(action).pipe(
          this._callBefore(action),
          concatMap((response) => [
            this._actions.createSuccess(createSuccessActionBody(response, action)),
            ...this._reloadIdentifiers(this._actions.createSuccess, action),
          ]),
          catchError((error: HttpErrorResponse) =>
            of(this._actions.createError({ query: action.query, params: { error } })),
          ),
        ),
      ),
    );
  });

  set$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(this._actions.set),
      mergeMap(({ query, params, ...rest }) => [
        this._actions.setSuccess({ ...rest, query, params }),
        ...this._reloadIdentifiers(this._actions.setSuccess, rest),
      ]),
    );
  });

  update$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(this._actions.update),
      this._setIdentified(),
      mergeMap((action) =>
        this._http.update(action).pipe(
          this._callBefore(action),
          concatMap((params) => [
            this._actions.updateSuccess(createSuccessActionBody(params, action)),
            ...this._reloadIdentifiers(this._actions.updateSuccess, action),
          ]),
          catchError((error: HttpErrorResponse) =>
            of(this._actions.updateError({ query: action.query, params: { error } })),
          ),
        ),
      ),
    );
  });

  updateAll$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(this._actions.updateAll),
      this._setIdentified(),
      mergeMap((action) =>
        this._http.updateAll(action).pipe(
          this._callBefore(action),
          concatMap((response) => [
            this._actions.updateAllSuccess(createSuccessActionBody(response, action)),
            ...this._reloadIdentifiers(this._actions.updateAllSuccess, action),
          ]),
          catchError((error: HttpErrorResponse) =>
            of(this._actions.updateAllError({ query: action.query, params: { error } })),
          ),
        ),
      ),
    );
  });

  delete$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(this._actions.delete),
      this._setIdentified(),
      mergeMap((action) =>
        this._http.delete(action).pipe(
          this._callBefore(action),
          concatMap((params) => [
            this._actions.deleteSuccess(createSuccessActionBody(params, action)),
            ...this._reloadIdentifiers(this._actions.deleteSuccess, action),
          ]),
          catchError((error: HttpErrorResponse) =>
            of(this._actions.deleteError({ query: action.query, params: { error } })),
          ),
        ),
      ),
    );
  });

  constructor(
    protected _actions: ActionsBase<T>,
    protected _selectors: SelectorsBase<T>,
    protected _http: HttpServiceBase<T>,
  ) {}

  private _setIdentified<T extends Options & Action>() {
    return tap<T>((action) => {
      const identified = action.identified;

      if (identified) this.identifiers[identified] = action;
    });
  }

  private _reloadIdentifiers = <K extends Options>(refAction: Action, options: K) => {
    if (options?.reloadIdentifiers)
      return Object.values(this.identifiers).map((action) => ({
        ...action,
        ref: refAction,
      }));

    return [];
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _callBefore = <T extends { before?: Params }>(action: ActionInit<any, any, T['before']>) =>
    concatMap<T, ObservableInput<T>>((response) => {
      if (!action.beforeSuccess) return of(response);

      return action.beforeSuccess(response.before).pipe(
        first(),
        map(() => response),
      );
    });
}
