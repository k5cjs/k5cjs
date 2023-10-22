import { PartialDeep } from './partial-deep.type';

interface User {
  name: string;
  age: number;
  address: {
    city: string;
    country: string;
  };
}

type PartialUser = PartialDeep<User>;

describe('PartialDeppType', () => {
  it('should create', () => {
    const user: PartialUser = {};

    expect(user).toBeTruthy();
  });
});
