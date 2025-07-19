import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AssignmentEntity } from '../assignment/assignment.entity';

@Entity({ name: 'medications' })
export class MedicationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  dosage: string;

  @Column()
  frequency: string;

  // A medication can be assigned to many patients
  @OneToMany(() => AssignmentEntity, (assignment) => assignment.medication)
  assignments: AssignmentEntity[];
}
