import { getRepository, Repository } from 'typeorm';

import { Role } from 'orm/entities/users/types';
import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

const USER_SELECT: (keyof User)[] = [
  'id',
  'name',
  'fullName',
  'phone',
  'email',
  'role',
  'language',
  'registeredAt',
  'created_at',
  'updated_at',
];

type DispatcherPayload = {
  email: string;
  phone: string;
  fullName: string;
  password: string;
};

type EditPayload = {
  name: string;
};

export class UserService {
  private userRepository: Repository<User>;

  constructor(userRepository: Repository<User> = getRepository(User)) {
    this.userRepository = userRepository;
  }

  public async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: USER_SELECT,
      order: { id: 'ASC' },
    });
  }

  public async findOneOrFail(id: string | number): Promise<User> {
    const user = await this.userRepository.findOne(id, {
      select: USER_SELECT,
    });

    if (!user) {
      throw new CustomError(404, 'General', `User with id:${id} not found.`, ['User not found.']);
    }

    return user;
  }

  public async createDispatcher(payload: DispatcherPayload): Promise<User> {
    await this.ensureUnique(payload.email, payload.phone, 409);

    const dispatcher = this.userRepository.create({
      email: payload.email,
      phone: payload.phone,
      fullName: payload.fullName,
      name: payload.fullName,
      password: payload.password,
      role: 'DISPATCHER' as Role,
      registeredAt: new Date(),
    });
    dispatcher.hashPassword();

    try {
      const saved = await this.userRepository.save(dispatcher);
      return this.findOneOrFail(saved.id);
    } catch (err) {
      throw new CustomError(400, 'Raw', "Dispatcher can't be created", null, err);
    }
  }

  public async update(id: string, payload: EditPayload): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new CustomError(404, 'General', `User with id:${id} not found.`, ['User not found.']);
    }

    user.name = payload.name;

    try {
      await this.userRepository.save(user);
      return this.findOneOrFail(id);
    } catch (err) {
      throw new CustomError(409, 'Raw', `User '${user.email}' can't be saved.`, null, err);
    }
  }

  public async delete(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new CustomError(404, 'General', 'Not Found', [`User with id:${id} doesn't exists.`]);
    }

    await this.userRepository.delete(id);
    return user;
  }

  private async ensureUnique(email: string, phone: string, statusCode = 400): Promise<void> {
    const existing = await this.userRepository.findOne({ where: [{ email }, { phone }] });
    if (!existing) {
      return;
    }

    const conflicts = [];
    if (existing.email === email) {
      conflicts.push(`Email '${email}' already exists`);
    }
    if (phone && existing.phone === phone) {
      conflicts.push(`Phone '${phone}' already exists`);
    }

    throw new CustomError(statusCode, 'General', 'User already exists', conflicts);
  }
}
