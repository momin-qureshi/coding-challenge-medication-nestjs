import { MedicationEntity } from './medication.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMedicationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  dosage?: string;

  @IsString()
  frequency?: string;
}

export interface MedicationDto {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
}

export function toMedicationDto(entity: MedicationEntity): MedicationDto {
  const { id, name, dosage, frequency } = entity;
  return { id, name, dosage, frequency };
}
