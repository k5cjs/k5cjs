import { EntityAdapter } from '@ngrx/entity';
import { ActionCreator, ReducerTypes, on } from '@ngrx/store';

import { ActionsBase } from './store.actions';
import { StateBase } from './store.type';

const resetQueries = <
  T extends { id: PropertyKey },
  K extends { resetQueries?: boolean; reloadIdentifiers?: boolean; reloadSelectors?: boolean },
>(
  options: K,
  values: Partial<Pick<StateBase<T>, 'loadings' | 'queries' | 'errors'>>,
): Pick<StateBase<T>, 'loadings' | 'queries' | 'errors'> | object =>
  options?.resetQueries
    ? {
        loadings: { ...values.loadings },
        errors: { ...values.errors },
        queries: { ...values.queries },
      }
    : {};

const reloadSelectors = <
  T extends { id: PropertyKey },
  K extends { resetQueries?: boolean; reloadIdentifiers?: boolean; reloadSelectors?: boolean },
>(
  state: StateBase<T>,
  options: K,
): Partial<StateBase<T>> | object => (options?.reloadSelectors ? { reloadSelectors: state.reloadSelectors + 1 } : {});

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
  on(
    actions.getByQuery,
    actions.getById,
    actions.create,
    actions.set,
    actions.update,
    actions.updateAll,
    actions.delete,
    (state, { query }) => ({
      ...state,
      loadings: { ...state.loadings, [query]: true },
      errors: { ...state.errors, [query]: undefined },
    }),
  ),

  on(actions.getByQueryIsLoaded, actions.getByIdIsLoaded, (state, { query }) => ({
    ...state,
    loadings: { ...state.loadings, [query]: false },
  })),

  on(
    actions.getByQueryError,
    actions.getByIdError,
    actions.createError,
    actions.updateError,
    actions.updateAllError,
    actions.deleteError,
    (state, { query, params: { error } }) => ({
      ...state,
      loadings: { ...state.loadings, [query]: false },
      errors: { ...state.errors, [query]: error },
    }),
  ),

  on(actions.getByQuerySuccess, (state, { query, params: { items, config }, ...options }) =>
    adapter.upsertMany(items, {
      ...state,
      loadings: { ...state.loadings, [query]: false },
      errors: { ...state.errors, [query]: undefined },
      queries: { ...state.queries, [query]: { ...config, ids: items.map((item) => adapter.selectId(item)) } },
      ...reloadSelectors(state, options),
    }),
  ),

  on(actions.getByIdSuccess, (state, { query, params: { item, config }, ...options }) =>
    adapter.upsertOne(item, {
      ...state,
      loadings: { ...state.loadings, [query]: false },
      errors: { ...state.errors, [query]: undefined },
      queries: { ...state.queries, [query]: { ...config, ids: [adapter.selectId(item)] } },
      ...reloadSelectors(state, options),
    }),
  ),

  on(actions.createSuccess, (state, { query, params: { item, config }, ...options }) =>
    adapter.addOne(item, {
      ...state,
      loadings: { ...state.loadings, [query]: false },
      errors: { ...state.errors, [query]: undefined },
      queries: { ...state.queries, [query]: { ...config, ids: [adapter.selectId(item)] } },
      ...resetQueries(options, {
        loadings: { [query]: false },
        errors: { [query]: undefined },
        queries: { [query]: { ...config, ids: [adapter.selectId(item)] } },
      }),
      ...reloadSelectors(state, options),
    }),
  ),

  on(actions.setSuccess, (state, { query, params: { items, config }, ...options }) =>
    adapter.upsertMany(items, {
      ...state,
      loadings: { ...state.loadings, [query]: false },
      errors: { ...state.errors, [query]: undefined },
      queries: { ...state.queries, [query]: { ...config, ids: items.map((item) => adapter.selectId(item)) } },
      ...resetQueries(options, {
        loadings: { [query]: false },
        errors: { [query]: undefined },
        queries: { [query]: { ...config, ids: items.map((item) => adapter.selectId(item)) } },
      }),
      ...reloadSelectors(state, options),
    }),
  ),

  on(actions.updateSuccess, (state, { query, params: { item, config }, ...options }) =>
    adapter.updateOne(
      { id: adapter.selectId(item) as string, changes: item },
      {
        ...state,
        loadings: { ...state.loadings, [query]: false },
        errors: { ...state.errors, [query]: undefined },
        queries: { ...state.queries, [query]: { ...config, ids: [adapter.selectId(item)] } },
        ...reloadSelectors(state, options),
      },
    ),
  ),

  on(actions.updateAllSuccess, (state, { query, params: { items, config }, ...options }) =>
    adapter.updateMany(
      items.map((item) => ({ id: adapter.selectId(item) as string, changes: item })),
      {
        ...state,
        loadings: { ...state.loadings, [query]: false },
        errors: { ...state.errors, [query]: undefined },
        queries: { ...state.queries, [query]: { ...config, ids: items.map((item) => adapter.selectId(item)) } },
        ...reloadSelectors(state, options),
      },
    ),
  ),

  on(actions.deleteSuccess, (state, { query, params: { item }, ...options }) =>
    adapter.removeOne(item.id as string, {
      ...state,
      loadings: { ...state.loadings, [query]: undefined },
      errors: { ...state.errors, [query]: undefined },
      queries: { ...state.queries, [query]: undefined },
      ...resetQueries(options, {
        loadings: { [query]: undefined },
        errors: { [query]: undefined },
        queries: { [query]: undefined },
      }),
      ...reloadSelectors(state, options),
    }),
  ),
];
