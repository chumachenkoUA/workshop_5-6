import 'mocha';
import { expect } from 'chai';

import { validatorRegister } from 'middleware/validation/auth';
import { User } from 'orm/entities/users/User';
import { AuthService } from 'services/auth/AuthService';
import { CustomError } from 'utils/response/custom-error/CustomError';

class FakeUserRepository {
  private data: User[] = [];
  private lastId = 0;

  async findOne(options: any): Promise<User | undefined> {
    const where = options?.where;
    if (Array.isArray(where)) {
      return this.data.find((u) => where.some((cond) => u.email === cond.email || u.phone === cond.phone));
    }
    if (where?.email) {
      return this.data.find((u) => u.email === where.email);
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

  async delete(filter: Partial<User>) {
    const before = this.data.length;
    this.data = this.data.filter((u) => u.email !== filter.email);
    return { affected: before !== this.data.length ? 1 : 0 };
  }
}

const runValidator = (body: Record<string, any>) =>
  new Promise((resolve, reject) => {
    const req: any = { body };
    validatorRegister(req, {} as any, (err?: any) => {
      if (err) reject(err);
      else resolve(req);
    });
  });

describe('Register (service)', () => {
  let fakeRepo: FakeUserRepository;
  let authService: AuthService;

  const userPassword = 'pass1';
  const user = new User();
  user.email = 'brandon.mayhew@test.com';
  user.phone = '+380991234567';
  user.fullName = 'Brandon Mayhew';
  user.password = userPassword;
  user.hashPassword();

  beforeEach(() => {
    fakeRepo = new FakeUserRepository();
    authService = new AuthService(fakeRepo as any);
  });

  it('should register a new user', async () => {
    await runValidator({
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      password: userPassword,
      passwordConfirm: userPassword,
    });
    const saved = await authService.register({
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      password: userPassword,
    });
    expect(saved.id).to.be.a('number');
    expect(saved.email).to.equal(user.email);
  });

  it('should report error when email already exists', async () => {
    await authService.register({
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      password: userPassword,
    });
    try {
      await authService.register({
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
        password: userPassword,
      });
      throw new Error('should have failed');
    } catch (err) {
      expect(err).to.be.instanceOf(CustomError);
      const customError = err as CustomError;
      expect(customError.JSON.errorMessage).to.equal('User already exists');
      expect(customError.JSON.errors).to.include(`Email '${user.email}' already exists`);
    }
  });
});
