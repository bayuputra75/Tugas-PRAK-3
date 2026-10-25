import { Router } from 'express';
import { LikeController } from '../controllers/likeController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { validate } from '../middlewares/validate.ts';
import { createLikeSchema, likeParamsSchema } from '../schemas/likeSchema.ts';

const likeRouter = Router();
const controller = new LikeController();

likeRouter.post('/', authenticate, validate(createLikeSchema, 'body'), controller.create);
likeRouter.delete(
  '/:reviewId/:userId',
  authenticate,
  validate(likeParamsSchema, 'params'),
  controller.delete,
);

export { likeRouter };