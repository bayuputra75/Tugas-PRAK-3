import bcrypt from 'bcryptjs';

function getSaltRounds(): number {
  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
  if (!Number.isInteger(rounds) || rounds < 10 || rounds > 15) {
    throw new Error('BCRYPT_SALT_ROUNDS harus berupa bilangan bulat antara 10 dan 15');
  }
  return rounds;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, getSaltRounds());
}

export function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
