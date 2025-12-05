import { User } from 'orm/entities/users/User';

export class UserResponseDTO {
  id: number;
  name: string | null;
  fullName: string | null;
  phone: string | null;
  email: string;
  role: string;
  language: string;
  registeredAt: Date | null;
  created_at: Date;
  updated_at: Date;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.fullName = user.fullName;
    this.phone = user.phone;
    this.email = user.email;
    this.role = user.role;
    this.language = user.language;
    this.registeredAt = user.registeredAt;
    this.created_at = user.created_at;
    this.updated_at = user.updated_at;
  }
}
