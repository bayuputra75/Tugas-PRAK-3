import { Router } from 'express';
import { AuditController } from '../controllers/auditController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { authorize } from '../middlewares/authorize.ts';
import { validate } from '../middlewares/validate.ts';
import { auditQuerySchema, createAuditSchema } from '../schemas/auditSchema.ts';

const auditRouter = Router();
const controller = new AuditController();

auditRouter.get('/', authenticate, authorize('admin'), validate(auditQuerySchema, 'query'), controller.getAll);
auditRouter.post('/', authenticate, authorize('admin'), validate(createAuditSchema, 'body'), controller.create);

export { auditRouter };