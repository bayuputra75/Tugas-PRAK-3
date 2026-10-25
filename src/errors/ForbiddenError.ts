import { AppError } from './AppError.ts';

export class ForbiddenError extends AppError {
  constructor(message = 'Anda tidak memiliki akses ke resource ini') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}
