import type { Request, Response } from 'express';
import { getUser } from '../middlewares/auth.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { CreateLegacyReviewInput, CreateReviewInput } from '../schemas/reviewSchema.ts';
import type { IdParam } from '../schemas/stallSchema.ts';
import type { ReviewParams, ReviewQuery } from '../schemas/reviewSchema.ts';
import { ReviewService } from '../services/reviewService.ts';

export class ReviewController {
  constructor(private readonly service = new ReviewService()) {}

  getAll = async (_req: Request, res: Response): Promise<Response> => {
    const { stallId } = getValidated<ReviewQuery>(res, 'query');
    return res.status(200).json({ status: 'success', data: await this.service.getReviews(stallId) });
  };

  getById = async (_req: Request, res: Response): Promise<Response> => {
    const { id } = getValidated<ReviewParams>(res, 'params');
    return res.status(200).json({ status: 'success', data: await this.service.getReview(id) });
  };

  createForStall = async (req: Request, res: Response): Promise<Response> => {
    const { id: stallId } = getValidated<IdParam>(res, 'params');
    const input = getValidated<CreateReviewInput>(res, 'body');
    const data = await this.service.createReview({ ...input, stallId, userId: getUser(req).id });
    return res.status(201).json({ status: 'success', data });
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    const input = getValidated<CreateLegacyReviewInput>(res, 'body');
    const data = await this.service.createReview({ ...input, userId: getUser(req).id });
    return res.status(201).json({ status: 'success', data });
  };

  delete = async (_req: Request, res: Response): Promise<Response> => {
    const { id } = getValidated<ReviewParams>(res, 'params');
    return res.status(200).json({ status: 'success', data: await this.service.deleteReview(id) });
  };
}
