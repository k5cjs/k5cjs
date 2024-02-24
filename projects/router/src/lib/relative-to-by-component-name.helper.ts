import { ActivatedRoute } from '@angular/router';

export const relativeToByComponentName = (route: ActivatedRoute, name: string): ActivatedRoute => {
  if (route.component?.name === name) return route;

  if (!route.parent) return route;

  return relativeToByComponentName(route.parent, name);
};
