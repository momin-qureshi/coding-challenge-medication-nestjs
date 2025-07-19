import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicationEntity } from './medication.entity';
import { AssignmentEntity } from '../assignment/assignment.entity';
import { MedicationDto, toMedicationDto } from './medication.dto';

@Injectable()
export class MedicationService {
  constructor(
    @InjectRepository(MedicationEntity)
    private readonly repo: Repository<MedicationEntity>,
    @InjectRepository(AssignmentEntity)
    private readonly assignmentRepo: Repository<AssignmentEntity>,
  ) {}

  async create(data: Partial<MedicationEntity>): Promise<MedicationDto> {
    const entity = this.repo.create(data);
    const saved = await this.repo.save(entity);
    return toMedicationDto(saved);
  }

  async findAll(limit?: number, offset?: number): Promise<MedicationDto[]> {
    const items = await this.repo.find({
      take: limit,
      skip: offset,
      order: { id: 'ASC' },
    });
    return items.map(toMedicationDto);
  }

  async findOne(id: number): Promise<MedicationDto> {
    const med = await this.repo.findOne({ where: { id } });
    if (!med) throw new NotFoundException('Medication not found');
    return toMedicationDto(med);
  }

  async update(
    id: number,
    data: Partial<MedicationEntity>,
  ): Promise<MedicationDto> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Medication not found');
    Object.assign(existing, data);
    const saved = await this.repo.save(existing);
    return toMedicationDto(saved);
  }

  async remove(id: number): Promise<{ deleted: true }> {
    const count = await this.assignmentRepo.count({
      where: { medication: { id } },
    });
    if (count > 0)
      throw new BadRequestException(
        'Medication is assigned and cannot be removed',
      );
    const result = await this.repo.delete(id);
    if (!result.affected) throw new NotFoundException('Medication not found');
    return { deleted: true };
  }
}
