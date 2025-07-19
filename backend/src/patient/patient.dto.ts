import { AssignmentDto, toAssignmentDto } from '../assignment/assignment.dto';
import { IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { PatientEntity } from './patient.entity';

export class CreatePatientDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsDateString()
  dateOfBirth: string;
}

export interface PatientDto {
  id: number;
  name: string;
  dateOfBirth: string; // ISO yyyy-mm-dd
  assignments?: AssignmentDto[];
}

export interface DeleteDto {
  deleted: boolean;
}

export function toPatientDto(entity: PatientEntity): PatientDto {
  const { id, name, dateOfBirth, assignments } = entity;
  return {
    id,
    name,
    dateOfBirth: new Date(dateOfBirth).toISOString().split('T')[0],
    assignments: (assignments ?? []).map(toAssignmentDto),
  };
}
