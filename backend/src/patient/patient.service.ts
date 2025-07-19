import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientEntity } from './patient.entity';
import { toPatientDto } from './patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientEntity)
    private readonly repo: Repository<PatientEntity>,
  ) {}

  async create(data: Partial<PatientEntity>): Promise<PatientEntity> {
    const patient = this.repo.create(data);
    return this.repo.save(patient);
  }

  async findAll(includeAssignments: boolean, limit?: number, offset?: number) {
    const [items, total] = await this.repo.findAndCount({
      relations: includeAssignments
        ? ['assignments', 'assignments.medication']
        : undefined,
      take: limit,
      skip: offset,
      order: { id: 'ASC' },
    });
    return {
      total,
      data: items.map(toPatientDto),
    };
  }

  async findOne(id: number) {
    const patient = await this.repo.findOne({
      where: { id },
      relations: ['assignments', 'assignments.medication'],
    });
    if (!patient) throw new NotFoundException('Patient not found');
    return toPatientDto(patient);
  }

  async update(
    id: number,
    data: Partial<PatientEntity>,
  ): Promise<PatientEntity> {
    await this.repo.update(id, data);
    const patient = await this.repo.findOne({
      where: { id },
      relations: ['assignments', 'assignments.medication'],
    });
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (!result.affected) throw new NotFoundException('Patient not found');
  }
}
