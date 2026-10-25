import { AppError } from './AppError.ts';

export class UnauthorizedError extends AppError {
  constructor(message = 'Autentikasi diperlukan atau token tidak valid') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}
