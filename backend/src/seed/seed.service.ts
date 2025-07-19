// src/seed/seed.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientEntity } from '../patient/patient.entity';
import { MedicationEntity } from '../medication/medication.entity';
import { AssignmentEntity } from '../assignment/assignment.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(PatientEntity)
    private patients: Repository<PatientEntity>,
    @InjectRepository(MedicationEntity)
    private medications: Repository<MedicationEntity>,
    @InjectRepository(AssignmentEntity)
    private assignments: Repository<AssignmentEntity>,
  ) {}

  async seed() {
    const patientCount = await this.patients.count();
    if (patientCount > 0) {
      console.log('Seed skipped - data already present');
      return;
    }

    const john = this.patients.create({
      name: 'John Doe',
      dateOfBirth: '1980-05-12',
    });
    const jane = this.patients.create({
      name: 'Jane Smith',
      dateOfBirth: '1990-11-03',
    });
    await this.patients.save([john, jane]);

    const ibuprofen = this.medications.create({
      name: 'Ibuprofen',
      dosage: '200mg',
      frequency: '3 times/day',
    });
    const amoxicillin = this.medications.create({
      name: 'Amoxicillin',
      dosage: '500mg',
      frequency: '2 times/day',
    });
    await this.medications.save([ibuprofen, amoxicillin]);

    const a1 = this.assignments.create({
      patient: john,
      medication: ibuprofen,
      startDate: new Date(),
      days: 5,
    });
    const a2 = this.assignments.create({
      patient: john,
      medication: amoxicillin,
      startDate: new Date(),
      days: 5,
    });
    const a3 = this.assignments.create({
      patient: jane,
      medication: amoxicillin,
      startDate: new Date(),
      days: 7,
    });
    await this.assignments.save([a1, a2, a3]);

    console.log('Database seeded');
  }
}
