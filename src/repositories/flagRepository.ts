import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { flags, reviews, users } from '../db/schema.ts';

export type FlagStatus = 'pending' | 'resolved' | 'rejected';

export class FlagRepository {
  async findAll() {
    const db = await getDb();
    return db.select({
      id: flags.id,
      reviewId: flags.reviewId,
      reportedBy: flags.reportedBy,
      reason: flags.reason,
      status: flags.status,
      createdAt: flags.createdAt,
      review: { rating: reviews.rating, comment: reviews.comment },
      reporter: { id: users.id, name: users.name },
    }).from(flags)
      .innerJoin(reviews, eq(flags.reviewId, reviews.id))
      .innerJoin(users, eq(flags.reportedBy, users.id))
      .orderBy(flags.id);
  }

  async updateStatus(id: number, status: FlagStatus) {
    const db = await getDb();
    const rows = await db.update(flags).set({ status }).where(eq(flags.id, id)).output();
    return rows[0];
  }
}