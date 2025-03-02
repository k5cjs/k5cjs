import { StateBase } from '@k5cjs/store';

export type State = StateBase<User>;

export interface User {
  id: string;
  name: string;
  age: number;
  nickname: string;
}
