import 'mocha';
import { expect } from 'chai';

import { Role } from 'orm/entities/users/types';
import { User } from 'orm/entities/users/User';
import { UserService } from 'services/users/UserService';
import { CustomError } from 'utils/response/custom-error/CustomError';

class FakeUserRepository {
  private data: User[] = [];
  private lastId = 0;

  constructor(seed: User[] = []) {
    this.data = seed.map((u, index) => {
      if (!u.id) {
        u.id = index + 1;
      }
      return u;
    });
    this.lastId = this.data.length ? Math.max(...this.data.map((u) => Number(u.id ?? 0))) : 0;
  }

  async find(): Promise<User[]> {
    return this.data;
  }

  async findOne(idOrOptions: any): Promise<User | undefined> {
    if (typeof idOrOptions === 'number' || typeof idOrOptions === 'string') {
      return this.data.find((u) => u.id === Number(idOrOptions));
    }
    const where = idOrOptions?.where;
    if (where?.id) {
      return this.data.find((u) => u.id === Number(where.id));
    }
    return undefined;
  }

  create(payload: Partial<User>): User {
    return Object.assign(new User(), payload);
  }

  async save(user: User): Promise<User> {
    if (!user.id) {
      this.lastId += 1;
      user.id = this.lastId;
    }
    this.data = this.data.filter((u) => u.id !== user.id).concat(user);
    return user;
  }

  async delete(criteria: any) {
    const id = typeof criteria === 'object' ? criteria.id : criteria;
    const before = this.data.length;
    this.data = this.data.filter((u) => u.id !== Number(id));
    return { affected: before !== this.data.length ? 1 : 0 };
  }
}

describe('Users (service)', () => {
  let fakeRepo: FakeUserRepository;
  let userService: UserService;

  const userPassword = 'pass1';
  const adminUser = new User();
  adminUser.name = 'Brandon Mayhew';
  adminUser.email = 'brandon.mayhew@test.com';
  adminUser.password = userPassword;
  adminUser.hashPassword();
  adminUser.role = 'ADMINISTRATOR' as Role;

  const transitUser = new User();
  transitUser.name = 'Todd Alquist';
  transitUser.email = 'todd.alquist@test.com';
  transitUser.password = userPassword;
  transitUser.hashPassword();
  transitUser.role = 'TRANSIT' as Role;

  beforeEach(() => {
    fakeRepo = new FakeUserRepository([adminUser, transitUser]);
    userService = new UserService(fakeRepo as any);
  });

  it('should get all users', async () => {
    const users = await userService.findAll();
    const emails = users.map((u) => u.email);
    expect(emails).to.include(adminUser.email);
    expect(emails).to.include(transitUser.email);
  });

  it('should get user by id', async () => {
    const user = await fakeRepo.findOne({ where: { id: 1 } });
    const found = await userService.findOneOrFail(user!.id);
    expect(found.email).to.equal(adminUser.email);
  });

  it('should throw when user not found', async () => {
    try {
      await userService.findOneOrFail(99999);
      throw new Error('should have failed');
    } catch (err) {
      expect(err).to.be.instanceOf(CustomError);
      const customError = err as CustomError;
      expect(customError.HttpStatusCode).to.equal(404);
    }
  });
});
