import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignmentEntity } from './assignment.entity';
import { PatientEntity } from '../patient/patient.entity';
import { MedicationEntity } from '../medication/medication.entity';
import { AssignmentDto, toAssignmentDto } from './assignment.dto';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(AssignmentEntity)
    private readonly repo: Repository<AssignmentEntity>,
    @InjectRepository(PatientEntity)
    private readonly patientRepo: Repository<PatientEntity>,
    @InjectRepository(MedicationEntity)
    private readonly medRepo: Repository<MedicationEntity>,
  ) {}

  async create(body: {
    patientId: number;
    medicationId: number;
    startDate?: string;
    totalDays?: number;
    remainingDays?: number;
  }): Promise<AssignmentDto> {
    const patient = await this.patientRepo.findOne({
      where: { id: body.patientId },
    });
    if (!patient) throw new NotFoundException('Patient not found');
    const medication = await this.medRepo.findOne({
      where: { id: body.medicationId },
    });
    if (!medication) throw new NotFoundException('Medication not found');

    const assignment = this.repo.create({
      patient,
      medication,
      startDate: body.startDate ? new Date(body.startDate) : new Date(),
      days: body.totalDays ?? body.remainingDays ?? 0,
    });
    const saved = await this.repo.save(assignment);
    return toAssignmentDto(saved);
  }

  async findAll(
    patientId?: number,
    activeOnly?: boolean,
    limit?: number,
    offset?: number,
  ): Promise<AssignmentDto[]> {
    const qb = this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.patient', 'patient')
      .leftJoinAndSelect('a.medication', 'medication');
    if (patientId) qb.andWhere('patient.id = :pid', { pid: patientId });
    qb.orderBy('a.id', 'ASC');
    if (limit !== undefined) qb.take(limit);
    if (offset !== undefined) qb.skip(offset);
    const items = await qb.getMany();
    let dtos = items.map(toAssignmentDto);
    if (activeOnly) {
      dtos = dtos.filter((d) => d.remainingDays > 0);
    }
    return dtos;
  }

  async findOne(id: number): Promise<AssignmentDto> {
    const assignment = await this.repo.findOne({
      where: { id },
      relations: ['patient', 'medication'],
    });
    if (!assignment) throw new NotFoundException('Assignment not found');
    return toAssignmentDto(assignment);
  }

  async update(
    id: number,
    body: Partial<{
      medicationId: number;
      startDate: string;
      totalDays: number;
    }>,
  ): Promise<AssignmentDto> {
    const assignment = await this.repo.findOne({
      where: { id },
    });
    if (!assignment) throw new NotFoundException('Assignment not found');
    if (body.medicationId) {
      const medication = await this.medRepo.findOne({
        where: { id: body.medicationId },
      });
      if (!medication) throw new NotFoundException('Medication not found');
      assignment.medication = medication;
    }
    if (body.startDate) assignment.startDate = new Date(body.startDate);
    if (body.totalDays !== undefined) assignment.days = body.totalDays;
    const saved = await this.repo.save(assignment);
    return toAssignmentDto(saved);
  }

  async remove(id: number): Promise<{ deleted: true }> {
    const result = await this.repo.delete(id);
    if (!result.affected) throw new NotFoundException('Assignment not found');
    return { deleted: true };
  }
}
