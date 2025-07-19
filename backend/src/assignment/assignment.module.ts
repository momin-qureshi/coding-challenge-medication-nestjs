import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentEntity } from './assignment.entity';
import { PatientEntity } from '../patient/patient.entity';
import { MedicationEntity } from '../medication/medication.entity';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AssignmentEntity,
      PatientEntity,
      MedicationEntity,
    ]),
  ],
  providers: [AssignmentService],
  controllers: [AssignmentController],
})
export class AssignmentModule {}
