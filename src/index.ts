import express, { type Request, type Response, type Application } from 'express';
import { sql } from 'drizzle-orm';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger-output.json' with { type: 'json' };
import { getDb } from './db/index.ts';
import { stallRouter } from './routes/stallRouter.ts';
import { menuItemRouter } from './routes/menuItemRouter.ts';
import { reviewRouter } from './routes/reviewRouter.ts';
import { likeRouter } from './routes/likeRouter.ts';
import { flagRouter } from './routes/flagRouter.ts';
import { auditRouter } from './routes/auditRouter.ts';
import { userRouter } from './routes/userRouter.ts';
import { authRouter } from './routes/authRouter.ts';
import { notFoundHandler } from './middlewares/notFound.ts';
import { errorHandler } from './middlewares/errorHandler.ts';
import { getJwtSecret } from './services/tokenService.ts';

const app: Application = express();
const PORT: number = 3000;

app.use(express.json());

// Dokumentasi OpenAPI 3.0 dihasilkan dari schema validasi Zod.
app.get('/docs/swagger.json', (_req, res) => {
  res.status(200).json(swaggerDocument);
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/health', async (_req: Request, res: Response) => {
  const db = await getDb();
  await db.execute(sql`SELECT 1 AS ok`);
  res.status(200).json({ status: 'success', message: 'Server dan database terhubung' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/stalls', stallRouter);
app.use('/auth', authRouter);
app.use('/stalls', stallRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/menu-items', menuItemRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/flags', flagRouter);
app.use('/api/v1/audit', auditRouter);

app.use(notFoundHandler);
app.use(errorHandler);

getJwtSecret();

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
