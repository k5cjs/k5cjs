export const code = (reloadSelectors: boolean, resetQueries: boolean, reloadIdentifiers: boolean) =>
  `this._users.getByQuery({ params: {} });

this._users
  .update({
    params: { item: { id: '2', age } },
    reloadSelectors: ${reloadSelectors},
    resetQueries: ${resetQueries},
    reloadIdentifiers: ${reloadIdentifiers},
  })
  .subscribe();`;
