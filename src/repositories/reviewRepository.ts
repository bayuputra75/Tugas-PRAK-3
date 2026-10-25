import { avg, count, eq, type SQL } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { flags, likes, reviews, stalls, users } from '../db/schema.ts';

export interface CreateReviewInput {
  stallId: number;
  userId: number;
  rating: number;
  comment?: string | null;
}

export class ReviewRepository {
  async findAll(stallId?: number) {
    const db = await getDb();
    const where: SQL | undefined = stallId === undefined ? undefined : eq(reviews.stallId, stallId);
    return db.select({
      id: reviews.id,
      stallId: reviews.stallId,
      userId: reviews.userId,
      rating: reviews.rating,
      comment: reviews.comment,
      likeCount: reviews.likeCount,
      createdAt: reviews.createdAt,
      updatedAt: reviews.updatedAt,
      user: { id: users.id, name: users.name },
    }).from(reviews).innerJoin(users, eq(reviews.userId, users.id)).where(where).orderBy(reviews.id);
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db.select({
      id: reviews.id,
      stallId: reviews.stallId,
      userId: reviews.userId,
      rating: reviews.rating,
      comment: reviews.comment,
      likeCount: reviews.likeCount,
      createdAt: reviews.createdAt,
      updatedAt: reviews.updatedAt,
      user: { id: users.id, name: users.name },
    }).from(reviews).innerJoin(users, eq(reviews.userId, users.id)).where(eq(reviews.id, id));
    return rows[0];
  }

  async create(input: CreateReviewInput) {
    const db = await getDb();
    const now = new Date();
    const rows = await db.insert(reviews).output().values({
      ...input,
      comment: input.comment ?? null,
      likeCount: 0,
      createdAt: now,
      updatedAt: now,
    });
    return rows[0];
  }

  async remove(id: number) {
    const db = await getDb();
    const current = await db.select().from(reviews).where(eq(reviews.id, id));
    if (!current[0]) return undefined;
    await db.delete(likes).where(eq(likes.reviewId, id));
    await db.delete(flags).where(eq(flags.reviewId, id));
    const rows = await db.delete(reviews).where(eq(reviews.id, id)).output();
    return rows[0];
  }

  async refreshStallRating(stallId: number) {
    const db = await getDb();
    const stats = await db.select({ average: avg(reviews.rating), total: count() })
      .from(reviews).where(eq(reviews.stallId, stallId));
    await db.update(stalls).set({
      avgRating: Number(stats[0]?.average ?? 0).toFixed(2),
      reviewCount: Number(stats[0]?.total ?? 0),
    }).where(eq(stalls.id, stallId));
  }
}