import { EntityAdapter } from '@ngrx/entity';
import { ActionCreator, ReducerTypes, on } from '@ngrx/store';

import { ActionsBase } from './store.actions';
import { ActionAllOptions, StateBase } from './store.type';

const resetQueries = <T extends { id: PropertyKey }>(
  options: ActionAllOptions['options'],
  values: Partial<Pick<StateBase<T>, 'loadings' | 'queries' | 'errors'>> = {},
): Pick<StateBase<T>, 'loadings' | 'queries' | 'errors'> | object =>
  options?.success?.resetQueries
    ? {
        loadings: { ...values.loadings },
        errors: { ...values.errors },
        queries: { ...values.queries },
      }
    : {};

const reloadSelectors = <T extends { id: PropertyKey }>(
  state: StateBase<T>,
  options: ActionAllOptions['options'],
): Partial<StateBase<T>> | object =>
  options?.success?.reloadSelectors ? { reloadSelectors: state.reloadSelectors + 1 } : {};

export const stateBase = <T extends { id: PropertyKey }>(): StateBase<T> => ({
  entities: {},
  ids: [],
  errors: {},
  loadings: {},
  queries: {},
  reloadSelectors: 0,
});

export const reducerBase = <T extends { id: PropertyKey }, S extends StateBase<T>>(
  adapter: EntityAdapter<T>,
  actions: ActionsBase<T>,
): ReducerTypes<S, readonly ActionCreator[]>[] => [
  on(actions.getByQuery, actions.getById, actions.create, actions.update, actions.delete, (state, { query }) => ({
    ...state,
    loadings: { ...state.loadings, [query]: true },
    errors: { ...state.errors, [query]: undefined },
  })),

  on(actions.getByQueryIsLoaded, actions.getByIdIsLoaded, (state, { query }) => ({
    ...state,
    loadings: { ...state.loadings, [query]: false },
  })),

  on(
    actions.getByQueryError,
    actions.getByIdError,
    actions.createError,
    actions.updateError,
    actions.deleteError,
    (state, { query, error }) => ({
      ...state,
      loadings: { ...state.loadings, [query]: false },
      errors: { ...state.errors, [query]: error },
    }),
  ),

  on(actions.getByQuerySuccess, (state, { query, response: { items, ...rest }, options }) =>
    adapter.addMany(items, {
      ...state,
      loadings: { ...state.loadings, [query]: false },
      queries: { ...state.queries, [query]: { ...rest, ids: items.map(({ id }) => id) } },
      ...reloadSelectors(state, options),
    }),
  ),

  on(actions.getByIdSuccess, (state, { query, response: { item, ...rest }, options }) =>
    adapter.upsertOne(item, {
      ...state,
      loadings: { ...state.loadings, [query]: false },
      queries: { ...state.queries, [query]: { ...rest, ids: [item.id] } },
      ...reloadSelectors(state, options),
    }),
  ),

  on(actions.createSuccess, (state, { query, response: { item, ...rest }, options }) =>
    adapter.addOne(item, {
      ...state,
      ...resetQueries(options, {
        loadings: { [query]: false },
        errors: { [query]: undefined },
        queries: { [query]: { ...rest, ids: [item.id] } },
      }),
      ...reloadSelectors(state, options),
    }),
  ),

  on(actions.updateSuccess, (state, { query, response: { item, ...rest }, options }) =>
    adapter.updateOne(
      { id: item.id as string, changes: item },
      {
        ...state,
        loadings: { ...state.loadings, [query]: false },
        queries: { ...state.queries, [query]: { ...rest, ids: [item.id] } },
        ...reloadSelectors(state, options),
      },
    ),
  ),

  on(actions.deleteSuccess, (state, { query, response: { id }, options }) =>
    adapter.removeOne(id as string, {
      ...state,
      loadings: { ...state.loadings, [query]: false },
      ...resetQueries(options),
      ...reloadSelectors(state, options),
    }),
  ),
];
