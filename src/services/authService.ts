import { AppError } from '../errors/AppError.ts';
import { UnauthorizedError } from '../errors/UnauthorizedError.ts';
import { UserRepository } from '../repositories/userRepository.ts';
import type { AuthUserDto, LoginResponseDto } from '../dtos/authDto.ts';
import type { LoginInput, RegisterInput } from '../schemas/authSchema.ts';
import { hashPassword, verifyPassword } from './passwordService.ts';
import { signToken, type AuthUser } from './tokenService.ts';

type UserRow = NonNullable<Awaited<ReturnType<UserRepository['findByEmail']>>>;

export class AuthService {
  constructor(private readonly userRepository = new UserRepository()) {}

  private toDto(row: UserRow): AuthUserDto {
    return { id: row.id, name: row.name, email: row.email, role: row.role };
  }

  async register(input: RegisterInput): Promise<AuthUserDto> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) throw new AppError(409, 'Email sudah terdaftar');

    const passwordHash = await hashPassword(input.password);
    const row = await this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: 'customer',
    });
    if (!row) throw new AppError(500, 'User gagal dibuat');
    return this.toDto(row);
  }

  async login(input: LoginInput): Promise<LoginResponseDto> {
    const row = await this.userRepository.findByEmail(input.email);
    if (!row || !(await verifyPassword(input.password, row.passwordHash))) {
      throw new UnauthorizedError('Email atau password salah');
    }

    const user: AuthUser = this.toDto(row);
    return {
      token: signToken(user),
      tokenType: 'Bearer',
      expiresIn: process.env.JWT_EXPIRES_IN ?? '2h',
      user,
    };
  }
}
