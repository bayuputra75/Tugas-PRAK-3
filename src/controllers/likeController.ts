import type { Request, Response } from 'express';
import { ForbiddenError } from '../errors/ForbiddenError.ts';
import { getUser } from '../middlewares/auth.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { CreateLikeInput, LikeParams } from '../schemas/likeSchema.ts';
import { LikeService } from '../services/likeService.ts';

export class LikeController {
  constructor(private readonly service = new LikeService()) {}

  create = async (req: Request, res: Response): Promise<Response> => {
    const { reviewId } = getValidated<CreateLikeInput>(res, 'body');
    const userId = getUser(req).id;
    return res.status(201).json({
      status: 'success',
      data: await this.service.createLike(reviewId, userId),
    });
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    const { reviewId, userId } = getValidated<LikeParams>(res, 'params');
    const currentUser = getUser(req);
    if (userId !== currentUser.id) {
      throw new ForbiddenError('Kamu hanya bisa menghapus like milikmu sendiri');
    }
    return res.status(200).json({
      status: 'success',
      data: await this.service.deleteLike(reviewId, currentUser.id),
    });
  };
}
