import { getRepository, Repository } from 'typeorm';

import { Role } from 'orm/entities/users/types';
import { User } from 'orm/entities/users/User';
import { JwtPayload } from 'types/JwtPayload';
import { createJwtToken } from 'utils/createJwtToken';
import { CustomError } from 'utils/response/custom-error/CustomError';

type RegisterPayload = {
  email: string;
  phone: string;
  fullName: string;
  password: string;
};

export class AuthService {
  private userRepository: Repository<User>;

  constructor(userRepository: Repository<User> = getRepository(User)) {
    this.userRepository = userRepository;
  }

  public async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !user.checkIfPasswordMatch(password)) {
      throw new CustomError(404, 'General', 'Not Found', ['Incorrect email or password']);
    }

    const jwtPayload: JwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
      created_at: user.created_at,
    };

    try {
      const token = createJwtToken(jwtPayload);
      return `Bearer ${token}`;
    } catch (err) {
      throw new CustomError(400, 'Raw', "Token can't be created", null, err);
    }
  }

  public async register(payload: RegisterPayload): Promise<User> {
    await this.ensureUnique(payload.email, payload.phone);

    const newUser = this.userRepository.create({
      email: payload.email,
      phone: payload.phone,
      fullName: payload.fullName,
      name: payload.fullName,
      password: payload.password,
      role: 'TRANSIT' as Role,
      registeredAt: new Date(),
    });
    newUser.hashPassword();

    try {
      const saved = await this.userRepository.save(newUser);
      return saved;
    } catch (err) {
      throw new CustomError(400, 'Raw', `User '${payload.email}' can't be created`, null, err);
    }
  }

  public async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new CustomError(404, 'General', 'Not Found', [`User ${userId} not found.`]);
    }

    if (!user.checkIfPasswordMatch(currentPassword)) {
      throw new CustomError(400, 'General', 'Not Found', ['Incorrect password']);
    }

    user.password = newPassword;
    user.hashPassword();
    await this.userRepository.save(user);
  }

  private async ensureUnique(email: string, phone: string): Promise<void> {
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

    throw new CustomError(400, 'General', 'User already exists', conflicts);
  }
}
