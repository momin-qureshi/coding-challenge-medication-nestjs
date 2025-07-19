// src/seed/seed.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from '../patient/patient.entity';
import { MedicationEntity } from '../medication/medication.entity';
import { AssignmentEntity } from '../assignment/assignment.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([PatientEntity, MedicationEntity, AssignmentEntity])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
