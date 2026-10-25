import { AuditRepository, type CreateAuditInput, type FindAuditParams } from '../repositories/auditRepository.ts';

export class AuditService {
  constructor(private readonly repository = new AuditRepository()) {}

  getAuditLogs(params: FindAuditParams) {
    return this.repository.findAll(params);
  }

  createAuditLog(input: CreateAuditInput) {
    return this.repository.create(input);
  }
}