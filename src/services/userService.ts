import { UserRepository, type CreateUserInput, type UserRole } from '../repositories/userRepository.ts';
import { AppError } from '../errors/AppError.ts';
import { hashPassword } from './passwordService.ts';

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export class UserService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async getUsers() {
    return this.userRepository.findAll();
  }

  async createUser(input: RegisterUserInput) {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) throw new AppError(409, 'Email sudah terdaftar');

    const passwordHash = await hashPassword(input.password);
    const userInput: CreateUserInput = {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    };
    const user = await this.userRepository.create(userInput);
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }
}