import { PartialDeep } from './partial-deep.type';

export type AtLeastDeep<T, K extends keyof T> = PartialDeep<T> & Pick<Required<T>, K>;
