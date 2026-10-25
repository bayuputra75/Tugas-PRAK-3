import 'dotenv/config';
import { inArray } from 'drizzle-orm';
import { getDb } from './index.ts';
import { users } from './schema.ts';
import { hashPassword } from '../services/passwordService.ts';

const testAccountEmails = [
  'admin@example.com',
  'owner.pagi@example.com',
  'owner.nusantara@example.com',
  'owner.kopi@example.com',
  'owner.sunda@example.com',
  'owner.bakso@example.com',
  'ayu@example.com',
  'bima@example.com',
  'citra@example.com',
  'danu@example.com',
  'eka@example.com',
];

async function seedTestAccountPasswords(): Promise<void> {
  const db = await getDb();
  const found = await db
    .select({ email: users.email })
    .from(users)
    .where(inArray(users.email, testAccountEmails));
  const foundEmails = new Set(found.map((user) => user.email));
  const missing = testAccountEmails.filter((email) => !foundEmails.has(email));
  if (missing.length > 0) {
    throw new Error(`Akun uji belum ada di database: ${missing.join(', ')}. Jalankan seed Tugas 2 terlebih dahulu.`);
  }

  const passwordHash = await hashPassword('rahasia123');
  const updated = await db
    .update(users)
    .set({ passwordHash })
    .where(inArray(users.email, testAccountEmails))
    .output();

  if (updated.length !== testAccountEmails.length) {
    throw new Error(`Jumlah akun uji yang diperbarui tidak sesuai: ${updated.length}/${testAccountEmails.length}`);
  }
  console.log(`Password bcrypt diperbarui untuk ${updated.length} akun uji.`);
}

seedTestAccountPasswords().catch((error: unknown) => {
  console.error('Pembaruan password akun uji gagal:', error);
  process.exitCode = 1;
});
