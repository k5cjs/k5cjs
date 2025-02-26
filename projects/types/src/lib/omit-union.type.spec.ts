import { OmitDistributive } from './omit-distributive.type';

const enum Type {
  Admin = 'admin',
  User = 'user',
}

interface Admin {
  name: string;
  age: number;
  type: Type.Admin;
  nickname: string;
}

interface User {
  name: string;
  age: number;
  type: Type.User;
  readonly: boolean;
}

type Users = Admin | User;

type UsersWithoutAge = OmitDistributive<Users, 'age'>;

describe('PartialDeppType', () => {
  it('should create', () => {
    const user1: UsersWithoutAge = {
      type: Type.Admin,
      nickname: 'nickname',
      name: 'name',
    };

    const user2: UsersWithoutAge = {
      type: Type.User,
      name: 'name',
      readonly: true,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const user3: UsersWithoutAge = {
      type: Type.User,
      name: 'name',
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const user4: UsersWithoutAge = {
      type: Type.Admin,
      name: 'name',
    };

    expect(user1).toBeTruthy();
    expect(user2).toBeTruthy();
    expect(user3).toBeTruthy();
    expect(user4).toBeTruthy();
  });
});
