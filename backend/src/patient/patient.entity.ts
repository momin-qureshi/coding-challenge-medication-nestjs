import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AssignmentEntity } from '../assignment/assignment.entity';

@Entity({ name: 'patients' })
export class PatientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date', name: 'date_of_birth' })
  dateOfBirth: Date;

  // A patient can have multiple medication assignments
  @OneToMany(() => AssignmentEntity, (assignment) => assignment.patient)
  assignments: AssignmentEntity[];
}
