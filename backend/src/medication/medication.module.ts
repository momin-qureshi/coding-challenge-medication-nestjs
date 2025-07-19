import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationEntity } from './medication.entity';
import { AssignmentEntity } from '../assignment/assignment.entity';
import { MedicationService } from './medication.service';
import { MedicationController } from './medication.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MedicationEntity, AssignmentEntity])],
  providers: [MedicationService],
  controllers: [MedicationController],
})
export class MedicationModule {}
