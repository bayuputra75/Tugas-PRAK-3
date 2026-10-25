import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { authorize } from '../middlewares/authorize.ts';
import { validate } from '../middlewares/validate.ts';
import {
  createLegacyReviewSchema,
  reviewParamsSchema,
  reviewQuerySchema,
} from '../schemas/reviewSchema.ts';

const reviewRouter = Router();
const controller = new ReviewController();

reviewRouter.get('/', validate(reviewQuerySchema, 'query'), controller.getAll);
reviewRouter.post('/', authenticate, validate(createLegacyReviewSchema, 'body'), controller.create);
reviewRouter.get('/:id', validate(reviewParamsSchema, 'params'), controller.getById);
reviewRouter.delete('/:id', authenticate, authorize('admin'), validate(reviewParamsSchema, 'params'), controller.delete);

export { reviewRouter };