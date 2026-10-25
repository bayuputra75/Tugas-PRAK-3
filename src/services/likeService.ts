import { LikeRepository } from '../repositories/likeRepository.ts';
import { AppError } from '../errors/AppError.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';

export class LikeService {
  constructor(private readonly repository = new LikeRepository()) {}

  getLikes() {
    return this.repository.findAll();
  }

  async createLike(reviewId: number, userId: number) {
    if (await this.repository.findByReviewAndUser(reviewId, userId)) {
      throw new AppError(409, 'Pengguna sudah menyukai ulasan ini');
    }
    const like = await this.repository.create(reviewId, userId);
    if (!like) throw new NotFoundError('Ulasan tidak ditemukan');
    return like;
  }

  async deleteLike(reviewId: number, userId: number) {
    const like = await this.repository.remove(reviewId, userId);
    if (!like) throw new NotFoundError('Like tidak ditemukan');
    return like;
  }
}