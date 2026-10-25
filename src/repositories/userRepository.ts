import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { users } from '../db/schema.ts';

export type UserRole = 'admin' | 'owner' | 'customer';

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export class UserRepository {
  async findByEmail(email: string) {
    const db = await getDb();
    const rows = await db.select().from(users).where(eq(users.email, email));
    return rows[0];
  }

  async findAll() {
    const db = await getDb();
    return db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    }).from(users).orderBy(users.id);
  }

  async create(input: CreateUserInput) {
    const db = await getDb();
    const rows = await db.insert(users).output().values(input);
    return rows[0];
  }
}