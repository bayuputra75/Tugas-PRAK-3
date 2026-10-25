import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError.ts';
import { verifyToken, type AuthUser } from '../services/tokenService.ts';

const BEARER_PREFIX = 'Bearer ';

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith(BEARER_PREFIX)) return null;
  const token = header.slice(BEARER_PREFIX.length).trim();
  return token || null;
}

export const authenticate: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = extractToken(req);
  if (!token) return next(new UnauthorizedError('Token Bearer diperlukan'));

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return next(new UnauthorizedError('Token tidak valid atau sudah kedaluwarsa'));
  }
};

export function getUser(req: Request): AuthUser {
  if (!req.user) throw new UnauthorizedError();
  return req.user;
}
