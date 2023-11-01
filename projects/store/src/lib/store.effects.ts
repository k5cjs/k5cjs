import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, concatMap, of, pipe, tap } from 'rxjs';

import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { ActionsBase } from './store.actions';
import { HttpServiceBase } from './store.http.service';
import { SelectorsBase } from './store.selectors';
import { ActionAllOptions } from './store.type';

const addActionReference = <T extends Action>(action: T, actionReference: Action): T => ({
  ...action,
  ref: actionReference.type,
});

const identified = <T extends Pick<ActionAllOptions, 'options'> & Action>(state: Record<PropertyKey, Action>) =>
  pipe(
    tap<T>((action) => {
      const identified = action.options?.init?.identified;

      if (identified) state[identified] = action;
    }),
  );

const reloadIdentifiers = (
  state: Record<PropertyKey, Action>,
  refAction: Action,
  options: ActionAllOptions['options'],
) => {
  if (options?.success?.reloadIdentifiers)
    return Object.values(state).map((action) => addActionReference(action, refAction));

  return [];
};

@Injectable()
export class EffectsBase<T extends { id: PropertyKey }> {
  protected _actions$ = inject(Actions);
  protected _store = inject(Store);

  protected identifiers: Record<PropertyKey, Action> = {};

  getByQuery$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(this._actions.getByQuery),
      identified(this.identifiers),
      concatLatestFrom(() => this._store.select(this._selectors.queries)),
      concatMap(([{ query, params, options }, queries]) =>
        queries[query]
          ? of(this._actions.getByQueryIsLoaded({ query }))
          : this._http.getByQuery(params).pipe(
              concatMap((response) => [
                this._actions.getByQuerySuccess({ query, response, options }),
                ...reloadIdentifiers(this.identifiers, this._actions.getByQuerySuccess, options),
              ]),
              catchError(({ message }: HttpErrorResponse) =>
                of(this._actions.getByQueryError({ query, error: message })),
              ),
            ),
      ),
    );
  });

  getById$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(this._actions.getById),
      identified(this.identifiers),
      concatLatestFrom(() => this._store.select(this._selectors.queries)),
      concatMap(([{ query, params, options }, queries]) =>
        queries[query]
          ? of(this._actions.getByIdIsLoaded({ query }))
          : this._http.getById(params).pipe(
              concatMap((response) => [
                this._actions.getByIdSuccess({ query, response, options }),
                ...reloadIdentifiers(this.identifiers, this._actions.getByIdSuccess, options),
              ]),
              catchError(({ message }: HttpErrorResponse) => of(this._actions.getByIdError({ query, error: message }))),
            ),
      ),
    );
  });

  create$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(this._actions.create),
      identified(this.identifiers),
      concatMap(({ query, params: { item }, options }) =>
        this._http.create(item).pipe(
          concatMap((response) => [
            this._actions.createSuccess({ query, response, options }),
            ...reloadIdentifiers(this.identifiers, this._actions.createSuccess, options),
          ]),
          catchError(({ message }: HttpErrorResponse) => of(this._actions.createError({ query, error: message }))),
        ),
      ),
    );
  });

  set$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(this._actions.set),
      identified(this.identifiers),
      concatMap(({ query, params: { items }, options }) => [
        this._actions.setSuccess({ query, response: { items }, options }),
        ...reloadIdentifiers(this.identifiers, this._actions.setSuccess, options),
      ]),
    );
  });

  update$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(this._actions.update),
      identified(this.identifiers),
      concatMap(({ query, params, options }) =>
        this._http.update(params).pipe(
          concatMap((response) => [
            this._actions.updateSuccess({ query, response, options }),
            ...reloadIdentifiers(this.identifiers, this._actions.updateSuccess, options),
          ]),
          catchError(({ message }: HttpErrorResponse) => of(this._actions.updateError({ query, error: message }))),
        ),
      ),
    );
  });

  delete$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(this._actions.delete),
      identified(this.identifiers),
      concatMap(({ query, params, options }) =>
        this._http.delete(params).pipe(
          concatMap(() => [
            this._actions.deleteSuccess({ query, response: params, options }),
            ...reloadIdentifiers(this.identifiers, this._actions.deleteSuccess, options),
          ]),
          catchError(({ message }: HttpErrorResponse) => of(this._actions.deleteError({ query, error: message }))),
        ),
      ),
    );
  });

  constructor(
    protected _actions: ActionsBase<T>,
    protected _selectors: SelectorsBase<T>,
    protected _http: HttpServiceBase<T>,
  ) {}
}
