import { MenuItemRepository, type MenuItemInput } from '../repositories/menuItemRepository.ts';
import { ForbiddenError } from '../errors/ForbiddenError.ts';
import { NotFoundError } from '../errors/NotFoundError.ts';
import type { AuthUser } from './tokenService.ts';
import { StallRepository } from '../repositories/stallRepository.ts';

export class MenuItemService {
  constructor(
    private readonly repository = new MenuItemRepository(),
    private readonly stallRepository = new StallRepository(),
  ) {}

  getMenuItems() {
    return this.repository.findAll();
  }

  async getMenuItem(id: number) {
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundError('Menu tidak ditemukan');
    return item;
  }

  private async assertStallAccess(stallId: number, user: AuthUser): Promise<void> {
    if (user.role === 'admin') return;
    const stall = await this.stallRepository.findById(stallId);
    if (!stall) throw new NotFoundError('Data warung tidak ditemukan');
    if (stall.ownerId !== user.id) {
      throw new ForbiddenError('Kamu hanya bisa mengelola menu warung milikmu sendiri');
    }
  }

  async createMenuItem(input: MenuItemInput, user: AuthUser) {
    await this.assertStallAccess(input.stallId, user);
    const created = await this.repository.create(input);
    if (!created) throw new NotFoundError('Menu gagal dibuat');
    return this.getMenuItem(created.id);
  }

  async updateMenuItem(id: number, input: Partial<MenuItemInput>, user: AuthUser) {
    const current = await this.repository.findById(id);
    if (!current) throw new NotFoundError('Menu tidak ditemukan');
    await this.assertStallAccess(current.stallId, user);
    if (input.stallId !== undefined) await this.assertStallAccess(input.stallId, user);
    if (Object.keys(input).length === 0) return current;

    const updated = await this.repository.update(id, input);
    if (!updated) throw new NotFoundError('Menu tidak ditemukan');
    return this.getMenuItem(id);
  }

  async deleteMenuItem(id: number, user: AuthUser) {
    const current = await this.repository.findById(id);
    if (!current) throw new NotFoundError('Menu tidak ditemukan');
    await this.assertStallAccess(current.stallId, user);
    const deleted = await this.repository.remove(id);
    if (!deleted) throw new NotFoundError('Menu tidak ditemukan');
    return deleted;
  }
}