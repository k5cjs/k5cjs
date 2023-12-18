import { HttpErrorResponse } from '@angular/common/http';

import { AtLeastDeep } from '@k5cjs/types';
import { createAction, props } from '@ngrx/store';

import { ActionCreatorType, ActionError, ActionInit, ActionSkip, ActionSuccess, Params } from './store.type';

type Init<T extends Params = Params> = ActionCreatorType<ActionInit<T>>;
type Skip<T extends Params = Params> = ActionCreatorType<ActionSkip<T>>;
type Success<T extends Params = Params> = ActionCreatorType<ActionSuccess<T>>;
type Error<T extends Params = Params> = ActionCreatorType<ActionError<T>>;

export class ActionsBase<T extends { id: PropertyKey }> {
  getByQuery: Init;
  getByQueryIsLoaded: Skip;
  getByQuerySuccess: Success<{ items: T[]; config?: Params; before?: Params }>;
  getByQueryError: Error<{ error: HttpErrorResponse }>;

  getById: Init<{ item: Pick<T, 'id'> }>;
  getByIdIsLoaded: Skip;
  getByIdSuccess: Success<{ item: T; config?: Params; before?: Params }>;
  getByIdError: Error<{ error: HttpErrorResponse }>;

  create: Init<{ item: Omit<T, 'id'> }>;
  createSuccess: Success<{ item: T; config?: Params; before?: Params }>;
  createError: Error<{ error: HttpErrorResponse }>;

  set: Init<{ items: T[]; config?: Params }>;
  setSuccess: Success<{ items: T[]; config?: Params }>;

  update: Init<{ item: AtLeastDeep<T, 'id'> }>;
  updateSuccess: Success<{ item: T; config?: Params; before?: Params }>;
  updateError: Error<{ error: HttpErrorResponse }>;

  delete: Init<{ item: Pick<T, 'id'> }>;
  deleteSuccess: Success<{ item: Pick<T, 'id'>; config?: Params; before?: Params }>;
  deleteError: Error<{ error: HttpErrorResponse }>;

  protected _type: (action: string) => string;

  constructor(protected readonly _storeKey: string) {
    this._type = (action: string): string => `[${this._storeKey.toLocaleUpperCase()}] ${action}`;

    this.getByQuery = createAction(this._type('get by query'), props<ActionInit>());
    this.getByQueryIsLoaded = createAction(this._type('get by query is loaded'), props<ActionSkip>());
    this.getByQuerySuccess = createAction(
      this._type('get by query success'),
      props<ActionSuccess<{ items: T[]; config?: Params; before?: Params }>>(),
    );
    this.getByQueryError = createAction(
      this._type('get by query error'),
      props<ActionError<{ error: HttpErrorResponse }>>(),
    );

    this.getById = createAction(this._type('get by id'), props<ActionInit<{ item: Pick<T, 'id'> }>>());
    this.getByIdIsLoaded = createAction(this._type('get by id is loaded'), props<ActionSkip>());
    this.getByIdSuccess = createAction(
      this._type('get by id success'),
      props<ActionSuccess<{ item: T; config?: Params; before?: Params }>>(),
    );
    this.getByIdError = createAction(this._type('get by id error'), props<ActionError<{ error: HttpErrorResponse }>>());

    this.create = createAction(this._type('create'), props<ActionInit<{ item: Omit<T, 'id'> }>>());
    this.createSuccess = createAction(
      this._type('create success'),
      props<ActionSuccess<{ item: T; config?: Params; before?: Params }>>(),
    );
    this.createError = createAction(this._type('create error'), props<ActionError<{ error: HttpErrorResponse }>>());

    this.set = createAction(this._type('set'), props<ActionInit<{ items: T[] }>>());
    this.setSuccess = createAction(this._type('set success'), props<ActionSuccess<{ items: T[] }>>());

    this.update = createAction(this._type('update'), props<ActionInit<{ item: AtLeastDeep<T, 'id'> }>>());
    this.updateSuccess = createAction(
      this._type('update success'),
      props<ActionSuccess<{ item: T; config?: Params; before?: Params }>>(),
    );
    this.updateError = createAction(this._type('update error'), props<ActionError<{ error: HttpErrorResponse }>>());

    this.delete = createAction(this._type('delete'), props<ActionInit<{ item: Pick<T, 'id'> }>>());
    this.deleteSuccess = createAction(
      this._type('delete success'),
      props<ActionSuccess<{ item: Pick<T, 'id'>; config?: Params; before?: Params }>>(),
    );
    this.deleteError = createAction(this._type('delete error'), props<ActionError<{ error: HttpErrorResponse }>>());
  }
}
