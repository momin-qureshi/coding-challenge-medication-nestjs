import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentService } from './assignment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AssignmentEntity } from './assignment.entity';
import { NotFoundException } from '@nestjs/common';
import { PatientEntity } from '../patient/patient.entity';
import { MedicationEntity } from '../medication/medication.entity';

describe('AssignmentService', () => {
  let service: AssignmentService;

  const mockAssignmentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockPatientRepository = {
    findOne: jest.fn(),
  };

  const mockMedicationRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignmentService,
        {
          provide: getRepositoryToken(AssignmentEntity),
          useValue: mockAssignmentRepository,
        },
        {
          provide: getRepositoryToken(PatientEntity),
          useValue: mockPatientRepository,
        },
        {
          provide: getRepositoryToken(MedicationEntity),
          useValue: mockMedicationRepository,
        },
      ],
    }).compile();

    service = module.get<AssignmentService>(AssignmentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw NotFoundException if patient not found', async (): Promise<void> => {
      mockPatientRepository.findOne.mockResolvedValue(null);

      await expect(
        service.create({
          patientId: 999,
          medicationId: 1,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if medication not found', async (): Promise<void> => {
      mockPatientRepository.findOne.mockResolvedValue({ id: 1 });
      mockMedicationRepository.findOne.mockResolvedValue(null);

      await expect(
        service.create({
          patientId: 1,
          medicationId: 999,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should find and return an assignment', async (): Promise<void> => {
      const assignment = {
        id: 1,
        patient: { id: 1 },
        medication: {
          id: 2,
          name: 'Test Medication',
          dosage: '10mg',
          frequency: 'daily',
        },
        startDate: new Date('2023-01-01'),
        totalDays: 30,
      };

      mockAssignmentRepository.findOne.mockResolvedValue(assignment);

      const result = await service.findOne(1);

      expect(mockAssignmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['patient', 'medication'],
      });
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if assignment not found', async (): Promise<void> => {
      mockAssignmentRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if assignment not found after update', async (): Promise<void> => {
      mockAssignmentRepository.update.mockResolvedValue({ affected: 1 });
      mockAssignmentRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, { totalDays: 45 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete an assignment', async () => {
      mockAssignmentRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockAssignmentRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if assignment not found during deletion', async () => {
      mockAssignmentRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
