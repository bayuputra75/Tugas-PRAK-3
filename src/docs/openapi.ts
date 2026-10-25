import { extendZodWithOpenApi, OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { auditQuerySchema, createAuditSchema } from '../schemas/auditSchema.ts';
import { loginSchema, registerSchema } from '../schemas/authSchema.ts';
import { flagParamsSchema, updateFlagSchema } from '../schemas/flagSchema.ts';
import { createLikeSchema, likeParamsSchema } from '../schemas/likeSchema.ts';
import { createMenuItemSchema, updateMenuItemSchema } from '../schemas/menuItemSchema.ts';
import { createLegacyReviewSchema, createReviewSchema, reviewParamsSchema, reviewQuerySchema } from '../schemas/reviewSchema.ts';
import { createStallSchema, idParamSchema, stallQuerySchema, updateStallSchema } from '../schemas/stallSchema.ts';
import { createUserSchema } from '../schemas/userSchema.ts';

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();
const okResponse = {
  description: 'Berhasil',
  content: { 'application/json': { schema: z.object({ status: z.literal('success'), data: z.unknown() }) } },
};
const failureResponse = {
  description: 'Validasi gagal atau request tidak dapat diproses',
  content: {
    'application/json': {
      schema: z.object({
        status: z.literal('fail'),
        message: z.string(),
        errors: z.array(z.object({ field: z.string(), message: z.string() })).optional(),
      }),
    },
  },
};

const bearerAuth = registry.registerComponent('securitySchemes', 'BearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

registry.register('StallQuery', stallQuerySchema);
registry.register('StallId', idParamSchema);
registry.register('CreateStall', createStallSchema);
registry.register('UpdateStall', updateStallSchema);
registry.register('Register', registerSchema);
registry.register('Login', loginSchema);
registry.register('Review', createReviewSchema);
registry.register('LegacyReview', createLegacyReviewSchema);
registry.register('ReviewQuery', reviewQuerySchema);
registry.register('ReviewId', reviewParamsSchema);
registry.register('CreateUser', createUserSchema);
registry.register('CreateMenuItem', createMenuItemSchema);
registry.register('UpdateMenuItem', updateMenuItemSchema);
registry.register('CreateLike', createLikeSchema);
registry.register('LikeParams', likeParamsSchema);
registry.register('AuditQuery', auditQuerySchema);
registry.register('CreateAudit', createAuditSchema);
registry.register('FlagId', flagParamsSchema);
registry.register('UpdateFlag', updateFlagSchema);

function registerAuthRoutes(basePath: string): void {
  const base = `${basePath}/auth`;
  registry.registerPath({
    method: 'post',
    path: `${base}/register`,
    tags: ['Auth'],
    summary: 'Daftar sebagai customer',
    request: { body: { content: { 'application/json': { schema: registerSchema } }, required: true } },
    responses: { 201: okResponse, 400: failureResponse, 409: failureResponse },
  });
  registry.registerPath({
    method: 'post',
    path: `${base}/login`,
    tags: ['Auth'],
    summary: 'Login dan memperoleh JWT',
    request: { body: { content: { 'application/json': { schema: loginSchema } }, required: true } },
    responses: { 200: okResponse, 400: failureResponse, 401: failureResponse },
  });
  registry.registerPath({
    method: 'get',
    path: `${base}/me`,
    tags: ['Auth'],
    summary: 'Membaca identitas dari JWT',
    security: [{ [bearerAuth.name]: [] }],
    responses: { 200: okResponse, 401: failureResponse },
  });
}

function registerStallRoutes(basePath: string): void {
  const base = `${basePath}/stalls`;
  registry.registerPath({
    method: 'get',
    path: base,
    tags: ['Stalls'],
    summary: 'Daftar warung dengan pencarian dan pagination',
    request: { query: stallQuerySchema },
    responses: { 200: okResponse, 400: failureResponse },
  });
  registry.registerPath({
    method: 'get',
    path: `${base}/{id}`,
    tags: ['Stalls'],
    summary: 'Detail warung',
    request: { params: idParamSchema },
    responses: { 200: okResponse, 400: failureResponse, 404: failureResponse },
  });
  registry.registerPath({
    method: 'post',
    path: base,
    tags: ['Stalls'],
    summary: 'Tambah warung (owner/admin)',
    security: [{ [bearerAuth.name]: [] }],
    request: { body: { content: { 'application/json': { schema: createStallSchema } }, required: true } },
    responses: { 201: okResponse, 400: failureResponse, 401: failureResponse, 403: failureResponse },
  });
  registry.registerPath({
    method: 'put',
    path: `${base}/{id}`,
    tags: ['Stalls'],
    summary: 'Ubah warung milik owner atau warung apa pun sebagai admin',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: idParamSchema,
      body: { content: { 'application/json': { schema: updateStallSchema } }, required: true },
    },
    responses: { 200: okResponse, 400: failureResponse, 401: failureResponse, 403: failureResponse, 404: failureResponse },
  });
  registry.registerPath({
    method: 'delete',
    path: `${base}/{id}`,
    tags: ['Stalls'],
    summary: 'Hapus warung (admin)',
    security: [{ [bearerAuth.name]: [] }],
    request: { params: idParamSchema },
    responses: { 200: okResponse, 400: failureResponse, 401: failureResponse, 403: failureResponse, 404: failureResponse },
  });
  registry.registerPath({
    method: 'get',
    path: `${base}/{id}/menus`,
    tags: ['Menu Items'],
    summary: 'Daftar menu suatu warung',
    request: { params: idParamSchema },
    responses: { 200: okResponse, 400: failureResponse, 404: failureResponse },
  });
  registry.registerPath({
    method: 'post',
    path: `${base}/{id}/reviews`,
    tags: ['Reviews'],
    summary: 'Tambah review (login semua role)',
    security: [{ [bearerAuth.name]: [] }],
    request: {
      params: idParamSchema,
      body: { content: { 'application/json': { schema: createReviewSchema } }, required: true },
    },
    responses: { 201: okResponse, 400: failureResponse, 401: failureResponse, 404: failureResponse },
  });
}

registerAuthRoutes('');
registerStallRoutes('');
registerAuthRoutes('/api/v1');
registerStallRoutes('/api/v1');

registry.registerPath({
  method: 'get',
  path: '/health',
  tags: ['System'],
  summary: 'Periksa koneksi database',
  responses: { 200: okResponse, 500: failureResponse },
});
registry.registerPath({
  method: 'get',
  path: '/api/v1/users',
  tags: ['Users'],
  security: [{ [bearerAuth.name]: [] }],
  responses: { 200: okResponse, 401: failureResponse, 403: failureResponse },
});
registry.registerPath({
  method: 'post',
  path: '/api/v1/users',
  tags: ['Users'],
  security: [{ [bearerAuth.name]: [] }],
  request: { body: { content: { 'application/json': { schema: createUserSchema } }, required: true } },
  responses: { 201: okResponse, 400: failureResponse, 401: failureResponse, 403: failureResponse, 409: failureResponse },
});
registry.registerPath({
  method: 'get',
  path: '/api/v1/menu-items',
  tags: ['Menu Items'],
  responses: { 200: okResponse },
});
registry.registerPath({
  method: 'post',
  path: '/api/v1/menu-items',
  tags: ['Menu Items'],
  security: [{ [bearerAuth.name]: [] }],
  request: { body: { content: { 'application/json': { schema: createMenuItemSchema } }, required: true } },
  responses: { 201: okResponse, 400: failureResponse, 401: failureResponse, 403: failureResponse },
});
registry.registerPath({
  method: 'get',
  path: '/api/v1/menu-items/{id}',
  tags: ['Menu Items'],
  request: { params: idParamSchema },
  responses: { 200: okResponse, 400: failureResponse, 404: failureResponse },
});
registry.registerPath({
  method: 'put',
  path: '/api/v1/menu-items/{id}',
  tags: ['Menu Items'],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: idParamSchema,
    body: { content: { 'application/json': { schema: updateMenuItemSchema } }, required: true },
  },
  responses: { 200: okResponse, 400: failureResponse, 401: failureResponse, 403: failureResponse, 404: failureResponse },
});
registry.registerPath({
  method: 'delete',
  path: '/api/v1/menu-items/{id}',
  tags: ['Menu Items'],
  security: [{ [bearerAuth.name]: [] }],
  request: { params: idParamSchema },
  responses: { 200: okResponse, 400: failureResponse, 401: failureResponse, 403: failureResponse, 404: failureResponse },
});
registry.registerPath({
  method: 'get',
  path: '/api/v1/reviews',
  tags: ['Reviews'],
  request: { query: reviewQuerySchema },
  responses: { 200: okResponse, 400: failureResponse },
});
registry.registerPath({
  method: 'post',
  path: '/api/v1/reviews',
  tags: ['Reviews'],
  security: [{ [bearerAuth.name]: [] }],
  request: { body: { content: { 'application/json': { schema: createLegacyReviewSchema } }, required: true } },
  responses: { 201: okResponse, 400: failureResponse, 401: failureResponse, 404: failureResponse },
});
registry.registerPath({
  method: 'get',
  path: '/api/v1/reviews/{id}',
  tags: ['Reviews'],
  request: { params: reviewParamsSchema },
  responses: { 200: okResponse, 400: failureResponse, 404: failureResponse },
});
registry.registerPath({
  method: 'delete',
  path: '/api/v1/reviews/{id}',
  tags: ['Reviews'],
  security: [{ [bearerAuth.name]: [] }],
  request: { params: reviewParamsSchema },
  responses: { 200: okResponse, 400: failureResponse, 401: failureResponse, 403: failureResponse, 404: failureResponse },
});
registry.registerPath({
  method: 'post',
  path: '/api/v1/likes',
  tags: ['Likes'],
  security: [{ [bearerAuth.name]: [] }],
  request: { body: { content: { 'application/json': { schema: createLikeSchema } }, required: true } },
  responses: { 201: okResponse, 400: failureResponse, 401: failureResponse, 404: failureResponse },
});
registry.registerPath({
  method: 'delete',
  path: '/api/v1/likes/{reviewId}/{userId}',
  tags: ['Likes'],
  security: [{ [bearerAuth.name]: [] }],
  request: { params: likeParamsSchema },
  responses: { 200: okResponse, 400: failureResponse, 401: failureResponse, 403: failureResponse, 404: failureResponse },
});
registry.registerPath({
  method: 'get',
  path: '/api/v1/flags',
  tags: ['Flags'],
  security: [{ [bearerAuth.name]: [] }],
  responses: { 200: okResponse, 401: failureResponse, 403: failureResponse },
});
registry.registerPath({
  method: 'put',
  path: '/api/v1/flags/{id}',
  tags: ['Flags'],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: flagParamsSchema,
    body: { content: { 'application/json': { schema: updateFlagSchema } }, required: true },
  },
  responses: { 200: okResponse, 400: failureResponse, 401: failureResponse, 403: failureResponse, 404: failureResponse },
});
registry.registerPath({
  method: 'get',
  path: '/api/v1/audit',
  tags: ['Audit'],
  security: [{ [bearerAuth.name]: [] }],
  request: { query: auditQuerySchema },
  responses: { 200: okResponse, 400: failureResponse, 401: failureResponse, 403: failureResponse },
});
registry.registerPath({
  method: 'post',
  path: '/api/v1/audit',
  tags: ['Audit'],
  security: [{ [bearerAuth.name]: [] }],
  request: { body: { content: { 'application/json': { schema: createAuditSchema } }, required: true } },
  responses: { 201: okResponse, 400: failureResponse, 401: failureResponse, 403: failureResponse },
});

export const openApiDocument = new OpenApiGeneratorV3(registry.definitions).generateDocument({
  openapi: '3.0.0',
  info: { title: 'Review Kantin API', version: '1.0.0' },
  servers: [{ url: 'http://localhost:3000' }],
});
