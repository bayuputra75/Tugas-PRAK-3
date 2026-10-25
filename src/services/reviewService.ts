import { ReviewRepository, type CreateReviewInput } from '../repositories/reviewRepository.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';

export class ReviewService {
  constructor(private readonly repository = new ReviewRepository()) {}

  getReviews(stallId?: number) {
    return this.repository.findAll(stallId);
  }

  async getReview(id: number) {
    const review = await this.repository.findById(id);
    if (!review) throw new NotFoundError('Ulasan tidak ditemukan');
    return review;
  }

  async createReview(input: CreateReviewInput) {
    const review = await this.repository.create(input);
    if (!review) throw new NotFoundError('Ulasan tidak ditemukan');
    await this.repository.refreshStallRating(input.stallId);
    return this.getReview(review.id);
  }

  async deleteReview(id: number) {
    const review = await this.repository.findById(id);
    if (!review) throw new NotFoundError('Ulasan tidak ditemukan');
    const deleted = await this.repository.remove(id);
    if (!deleted) throw new NotFoundError('Ulasan tidak ditemukan');
    await this.repository.refreshStallRating(review.stallId);
    return deleted;
  }
}