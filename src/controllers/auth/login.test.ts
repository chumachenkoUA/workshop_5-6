import 'mocha';
import { expect } from 'chai';

import { validatorLogin } from 'middleware/validation/auth';
import { Role } from 'orm/entities/users/types';
import { User } from 'orm/entities/users/User';
import { AuthService } from 'services/auth/AuthService';
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

  async findOne(options: any): Promise<User | undefined> {
    if (typeof options === 'number' || typeof options === 'string') {
      return this.data.find((u) => u.id === Number(options));
    }
    const where = options?.where;
    if (Array.isArray(where)) {
      return this.data.find((u) => where.some((cond) => u.email === cond.email || u.phone === cond.phone));
    }
    if (where?.email) {
      return this.data.find((u) => u.email === where.email);
    }
    return undefined;
  }

  async save(user: User): Promise<User> {
    if (!user.id) {
      this.lastId += 1;
      user.id = this.lastId;
    }
    this.data = this.data.filter((u) => u.id !== user.id).concat(user);
    return user;
  }

  async delete(id: number) {
    const before = this.data.length;
    this.data = this.data.filter((u) => u.id !== id);
    return { affected: before !== this.data.length ? 1 : 0 };
  }
}

const runValidator = (body: Record<string, any>) =>
  new Promise((resolve, reject) => {
    const req: any = { body };
    validatorLogin(req, {} as any, (err?: any) => {
      if (err) reject(err);
      else resolve(req);
    });
  });

describe('Login (service)', () => {
  const userPassword = 'pass1';
  const user = new User();
  user.name = 'Brandon Mayhew';
  user.email = 'brandon.mayhew@test.com';
  user.password = userPassword;
  user.hashPassword();
  user.role = 'ADMINISTRATOR' as Role;

  let fakeRepo: FakeUserRepository;
  let authService: AuthService;

  before(() => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
    process.env.JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
  });

  beforeEach(() => {
    fakeRepo = new FakeUserRepository([user]);
    authService = new AuthService(fakeRepo as any);
  });

  it('should return a JWT token', async () => {
    const token = await authService.login(user.email, userPassword);
    expect(token).to.be.a('string');
    expect(token.startsWith('Bearer ')).to.eql(true);
  });

  it("should report error when email and password don't match", async () => {
    try {
      await authService.login(user.email, 'wrong_password');
      throw new Error('should have failed');
    } catch (err) {
      expect(err).to.be.instanceOf(CustomError);
      const customError = err as CustomError;
      expect(customError.JSON.errors).to.eql(['Incorrect email or password']);
      expect(customError.HttpStatusCode).to.equal(404);
    }
  });

  it('should report validation error for invalid email', async () => {
    try {
      await runValidator({ email: 'not_valid_email', password: userPassword });
      throw new Error('should have failed');
    } catch (err) {
      expect(err).to.be.instanceOf(CustomError);
      const customError = err as CustomError;
      expect(customError.JSON.errorType).to.equal('Validation');
      expect(customError.JSON.errorsValidation).to.eql([{ email: 'Email is invalid' }]);
    }
  });
});
