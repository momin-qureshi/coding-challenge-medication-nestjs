import { Test, TestingModule } from '@nestjs/testing';
import { PatientService } from './patient.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PatientEntity } from './patient.entity';
import { NotFoundException } from '@nestjs/common';
import * as patientModule from './patient.dto';

// Mock the toPatientDto function to handle date conversion
jest.mock('./patient.dto', () => ({
  toPatientDto: jest.fn((entity: PatientEntity) => ({
    id: entity.id,
    name: entity.name,
    dateOfBirth:
      entity.dateOfBirth instanceof Date
        ? entity.dateOfBirth.toISOString().split('T')[0]
        : entity.dateOfBirth,
    assignments: entity.assignments || [],
  })),
}));

describe('PatientService', () => {
  let service: PatientService;

  const mockPatientRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientService,
        {
          provide: getRepositoryToken(PatientEntity),
          useValue: mockPatientRepository,
        },
      ],
    }).compile();

    service = module.get<PatientService>(PatientService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a patient', async () => {
      const patientData = {
        name: 'Test Patient',
        dateOfBirth: new Date('2000-01-01'),
      };

      const patientEntity = {
        id: 1,
        ...patientData,
        assignments: [],
      };

      mockPatientRepository.create.mockReturnValue(patientEntity);
      mockPatientRepository.save.mockResolvedValue(patientEntity);

      // Mock toPatientDto to handle date conversion
      jest
        .spyOn(patientModule, 'toPatientDto')
        .mockImplementation((entity) => ({
          id: entity.id,
          name: entity.name,
          dateOfBirth: '2000-01-01T00:00:00.000Z',
          assignments: [],
        }));

      const result = await service.create(patientData);

      expect(mockPatientRepository.create).toHaveBeenCalledWith(patientData);
      expect(mockPatientRepository.save).toHaveBeenCalledWith(patientEntity);
      expect(result).toEqual({
        id: 1,
        name: 'Test Patient',
        dateOfBirth: new Date('2000-01-01'),
        assignments: [],
      });
    });
  });

  describe('findAll', () => {
    it('should include assignments when requested', async () => {
      const patients = [
        {
          id: 1,
          name: 'Test Patient',
          dateOfBirth: new Date('2000-01-01'),
          assignments: [
            {
              id: 1,
              medication: { id: 1, name: 'Med 1' },
              startDate: new Date('2023-01-01'),
              days: 30,
            },
          ],
        },
      ];

      mockPatientRepository.findAndCount.mockResolvedValue([patients, 1]);

      const result = await service.findAll(true, 10, 0);

      expect(mockPatientRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['assignments', 'assignments.medication'],
        take: 10,
        skip: 0,
        order: { id: 'ASC' },
      });
      expect(result.total).toBe(1);
      expect(result.data[0].id).toBe(1);
      expect(result.data[0].name).toBe('Test Patient');
      expect(result.data[0].dateOfBirth).toBe(
        new Date('2000-01-01').toISOString(),
      );
    });
  });

  describe('findOne', () => {
    it('should find and return a patient', async () => {
      const patient = {
        id: 1,
        name: 'Test Patient',
        dateOfBirth: new Date('2000-01-01'),
        assignments: [],
      };

      mockPatientRepository.findOne.mockResolvedValue(patient);

      const result = await service.findOne(1);

      expect(mockPatientRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['assignments', 'assignments.medication'],
      });
      expect(result).toEqual({
        id: 1,
        name: 'Test Patient',
        dateOfBirth: '2000-01-01T00:00:00.000Z',
        assignments: [],
      });
    });

    it('should throw NotFoundException if patient not found', async () => {
      mockPatientRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return a patient', async () => {
      const updateData = { name: 'Updated Patient' };
      const patient = {
        id: 1,
        name: 'Updated Patient',
        dateOfBirth: new Date('2000-01-01'),
        assignments: [],
      };

      mockPatientRepository.update.mockResolvedValue({ affected: 1 });
      mockPatientRepository.findOne.mockResolvedValue(patient);

      const result = await service.update(1, updateData);

      expect(mockPatientRepository.update).toHaveBeenCalledWith(1, updateData);
      expect(mockPatientRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['assignments', 'assignments.medication'],
      });
      expect(result).toEqual({
        id: 1,
        name: 'Updated Patient',
        dateOfBirth: new Date('2000-01-01'),
        assignments: [],
      });
    });

    it('should throw NotFoundException if patient not found after update', async () => {
      mockPatientRepository.update.mockResolvedValue({ affected: 1 });
      mockPatientRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, { name: 'Updated' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a patient', async () => {
      mockPatientRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockPatientRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if patient not found during deletion', async () => {
      mockPatientRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
