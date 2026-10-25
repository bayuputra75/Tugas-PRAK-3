import { and, count, eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { likes, reviews } from '../db/schema.ts';

export class LikeRepository {
  async findAll() {
    const db = await getDb();
    return db.select().from(likes).orderBy(likes.id);
  }

  async findByReviewAndUser(reviewId: number, userId: number) {
    const db = await getDb();
    const rows = await db.select().from(likes)
      .where(and(eq(likes.reviewId, reviewId), eq(likes.userId, userId)));
    return rows[0];
  }

  async create(reviewId: number, userId: number) {
    const db = await getDb();
    const rows = await db.insert(likes).output().values({ reviewId, userId, createdAt: new Date() });
    await this.refreshReviewLikeCount(reviewId);
    return rows[0];
  }

  async remove(reviewId: number, userId: number) {
    const db = await getDb();
    const existing = await this.findByReviewAndUser(reviewId, userId);
    if (!existing) return undefined;
    const rows = await db.delete(likes).where(eq(likes.id, existing.id)).output();
    await this.refreshReviewLikeCount(reviewId);
    return rows[0];
  }

  private async refreshReviewLikeCount(reviewId: number) {
    const db = await getDb();
    const totals = await db.select({ total: count() }).from(likes).where(eq(likes.reviewId, reviewId));
    await db.update(reviews).set({ likeCount: Number(totals[0]?.total ?? 0) }).where(eq(reviews.id, reviewId));
  }
}