import { AssignmentEntity } from './assignment.entity';
import { IsInt, IsPositive, IsDateString } from 'class-validator';

export class CreateAssignmentDto {
  @IsInt()
  @IsPositive()
  patientId: number;

  @IsInt()
  @IsPositive()
  medicationId: number;

  @IsDateString()
  startDate?: string;

  @IsInt()
  @IsPositive()
  totalDays?: number;
}

import { MedicationDto, toMedicationDto } from '../medication/medication.dto';

export interface AssignmentDto {
  id: number;
  patientId: number;
  medication: MedicationDto;
  startDate: string; // ISO yyyy-mm-dd
  totalDays: number;
  remainingDays: number;
}

export function toAssignmentDto(entity: AssignmentEntity): AssignmentDto {
  const today = new Date();
  const elapsed = Math.ceil(
    (today.getTime() - new Date(entity.startDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  return {
    id: entity.id,
    patientId: entity.patient?.id,
    medication: toMedicationDto(entity.medication),
    startDate: new Date(entity.startDate).toISOString().split('T')[0],
    totalDays: entity.days,
    remainingDays: Math.max(entity.days - elapsed, 0),
  };
}
