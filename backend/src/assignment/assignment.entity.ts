import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PatientEntity } from '../patient/patient.entity';
import { MedicationEntity } from '../medication/medication.entity';

@Entity({ name: 'assignments' })
export class AssignmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PatientEntity, (patient) => patient.assignments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity;

  @ManyToOne(() => MedicationEntity, (medication) => medication.assignments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'medication_id' })
  medication: MedicationEntity;

  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'int' })
  days: number;
}
