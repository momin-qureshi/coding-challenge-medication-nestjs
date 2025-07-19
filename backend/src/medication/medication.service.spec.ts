import { Test, TestingModule } from '@nestjs/testing';
import { MedicationService } from './medication.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MedicationEntity } from './medication.entity';
import { AssignmentEntity } from '../assignment/assignment.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('MedicationService', () => {
  let service: MedicationService;

  const mockMedicationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockAssignmentRepository = {
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicationService,
        {
          provide: getRepositoryToken(MedicationEntity),
          useValue: mockMedicationRepository,
        },
        {
          provide: getRepositoryToken(AssignmentEntity),
          useValue: mockAssignmentRepository,
        },
      ],
    }).compile();

    service = module.get<MedicationService>(MedicationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a medication', async () => {
      const medicationData = {
        name: 'Test Medication',
        dosage: '10mg',
        frequency: 'daily',
      };

      const medicationEntity = {
        id: 1,
        ...medicationData,
      };

      mockMedicationRepository.create.mockReturnValue(medicationEntity);
      mockMedicationRepository.save.mockResolvedValue(medicationEntity);

      const result = await service.create(medicationData);

      expect(mockMedicationRepository.create).toHaveBeenCalledWith(
        medicationData,
      );
      expect(mockMedicationRepository.save).toHaveBeenCalledWith(
        medicationEntity,
      );
      expect(result).toEqual(medicationEntity);
    });
  });

  describe('findAll', () => {
    it('should return all medications', async () => {
      const medications = [
        {
          id: 1,
          name: 'Test Medication 1',
          dosage: '10mg',
          frequency: 'daily',
        },
        {
          id: 2,
          name: 'Test Medication 2',
          dosage: '20mg',
          frequency: 'twice daily',
        },
      ];

      mockMedicationRepository.find.mockResolvedValue(medications);

      const result = await service.findAll();

      expect(mockMedicationRepository.find).toHaveBeenCalled();
      expect(result).toEqual(medications);
    });
  });

  describe('findOne', () => {
    it('should find and return a medication', async () => {
      const medication = {
        id: 1,
        name: 'Test Medication',
        dosage: '10mg',
        frequency: 'daily',
      };

      mockMedicationRepository.findOne.mockResolvedValue(medication);

      const result = await service.findOne(1);

      expect(mockMedicationRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(medication);
    });

    it('should throw NotFoundException if medication not found', async () => {
      mockMedicationRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return a medication', async () => {
      const updateData = { dosage: '20mg' };
      const existingMedication = {
        id: 1,
        name: 'Test Medication',
        dosage: '10mg',
        frequency: 'daily',
      };
      const updatedMedication = {
        ...existingMedication,
        dosage: '20mg',
      };

      mockMedicationRepository.findOne.mockResolvedValue(existingMedication);
      mockMedicationRepository.save.mockResolvedValue(updatedMedication);

      const result = await service.update(1, updateData);

      expect(mockMedicationRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockMedicationRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          dosage: '20mg',
        }),
      );
      expect(result).toEqual(updatedMedication);
    });

    it('should throw NotFoundException if medication not found during update', async () => {
      mockMedicationRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, { dosage: '20mg' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a medication when not assigned', async () => {
      mockAssignmentRepository.count.mockResolvedValue(0);
      mockMedicationRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(1)).resolves.toEqual({ deleted: true });
      expect(mockAssignmentRepository.count).toHaveBeenCalledWith({
        where: { medication: { id: 1 } },
      });
      expect(mockMedicationRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException if medication is assigned', async () => {
      mockAssignmentRepository.count.mockResolvedValue(1);

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
      expect(mockMedicationRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if medication not found during deletion', async () => {
      mockAssignmentRepository.count.mockResolvedValue(0);
      mockMedicationRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
