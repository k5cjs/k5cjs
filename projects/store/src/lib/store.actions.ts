/* eslint-disable @typescript-eslint/no-explicit-any */
import { AtLeastDeep } from '@k5cjs/types';
import { createAction, props } from '@ngrx/store';

import { ActionCreatorType, ByQueryParams } from './store.type';

export class ActionsBase<T extends { id: PropertyKey }> {
  getByQuery: ActionCreatorType<{ params: ByQueryParams }>;
  getByQueryIsLoaded: ActionCreatorType;
  getByQuerySuccess: ActionCreatorType<{ response: { items: T[] } }>;
  getByQueryError: ActionCreatorType<{ error: string }>;

  getById: ActionCreatorType<{ params: { id: T['id'] } }>;
  getByIdIsLoaded: ActionCreatorType;
  getByIdSuccess: ActionCreatorType<{ response: { item: T } }>;
  getByIdError: ActionCreatorType<{ error: string }>;

  create: ActionCreatorType<{ params: { item: Omit<T, 'id'> } }>;
  createSuccess: ActionCreatorType<{ response: { item: T } }>;
  createError: ActionCreatorType<{ error: string }>;

  set: ActionCreatorType<{ params: { items: T[] } }>;
  setSuccess: ActionCreatorType<{ response: { items: T[] } }>;

  update: ActionCreatorType<{ params: { item: AtLeastDeep<T, 'id'> } }>;
  updateSuccess: ActionCreatorType<{ response: { item: T } }>;
  updateError: ActionCreatorType<{ error: string }>;

  delete: ActionCreatorType<{ params: { id: T['id'] } }>;
  deleteSuccess: ActionCreatorType<{ response: { id: T['id'] } }>;
  deleteError: ActionCreatorType<{ error: string }>;

  protected _type: (action: string) => string;

  constructor(protected readonly _storeKey: string) {
    this._type = (action: string): string => `[${this._storeKey.toLocaleUpperCase()}] ${action}`;

    this.getByQuery = createAction(this._type('get by query'), props<any>());
    this.getByQueryIsLoaded = createAction(this._type('get by query is loaded'), props<any>());
    this.getByQuerySuccess = createAction(this._type('get by query success'), props<any>());
    this.getByQueryError = createAction(this._type('get by query error'), props<any>());

    this.getById = createAction(this._type('get by id'), props<any>());
    this.getByIdIsLoaded = createAction(this._type('get by id is loaded'), props<any>());
    this.getByIdSuccess = createAction(this._type('get by id success'), props<any>());
    this.getByIdError = createAction(this._type('get by id error'), props<any>());

    this.create = createAction(this._type('create'), props<any>());
    this.createSuccess = createAction(this._type('create success'), props<any>());
    this.createError = createAction(this._type('create error'), props<any>());

    this.set = createAction(this._type('set'), props<any>());
    this.setSuccess = createAction(this._type('set success'), props<any>());

    this.update = createAction(this._type('update'), props<any>());
    this.updateSuccess = createAction(this._type('update success'), props<any>());
    this.updateError = createAction(this._type('update error'), props<any>());

    this.delete = createAction(this._type('delete'), props<any>());
    this.deleteSuccess = createAction(this._type('delete success'), props<any>());
    this.deleteError = createAction(this._type('delete error'), props<any>());
  }
}
