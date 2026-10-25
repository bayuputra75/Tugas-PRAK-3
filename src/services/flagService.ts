import { FlagRepository, type FlagStatus } from '../repositories/flagRepository.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';

export class FlagService {
  constructor(private readonly repository = new FlagRepository()) {}

  getFlags() {
    return this.repository.findAll();
  }

  async updateFlagStatus(id: number, status: FlagStatus) {
    const flag = await this.repository.updateStatus(id, status);
    if (!flag) throw new NotFoundError('Laporan tidak ditemukan');
    return flag;
  }
}