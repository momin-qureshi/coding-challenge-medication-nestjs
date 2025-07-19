import { Test, TestingModule } from '@nestjs/testing';
import { MedicationController } from './medication.controller';
import { MedicationService } from './medication.service';
import { CreateMedicationDto } from './medication.dto';

describe('MedicationController', () => {
  let controller: MedicationController;

  const mockMedicationService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicationController],
      providers: [
        {
          provide: MedicationService,
          useValue: mockMedicationService,
        },
      ],
    }).compile();

    controller = module.get<MedicationController>(MedicationController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a medication', async (): Promise<void> => {
      const dto: CreateMedicationDto = {
        name: 'Test Medication',
        dosage: '10mg',
        frequency: 'daily',
      };

      const result = {
        id: 1,
        ...dto,
      };

      mockMedicationService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(mockMedicationService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of medications', async (): Promise<void> => {
      const result = [
        {
          id: 1,
          name: 'Test Medication',
          dosage: '10mg',
          frequency: 'daily',
        },
      ];
      mockMedicationService.findAll.mockResolvedValue(result);

      expect(await controller.findAll(50, 0)).toEqual(result);
      expect(mockMedicationService.findAll).toHaveBeenCalledWith(50, 0);
    });
  });

  describe('findOne', () => {
    it('should return a medication by id', async (): Promise<void> => {
      const result = {
        id: 1,
        name: 'Test Medication',
        dosage: '10mg',
        frequency: 'daily',
      };
      mockMedicationService.findOne.mockResolvedValue(result);

      expect(await controller.findOne(1)).toEqual(result);
      expect(mockMedicationService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a medication', async (): Promise<void> => {
      const dto = { dosage: '20mg' };
      const result = {
        id: 1,
        name: 'Test Medication',
        dosage: '20mg',
        frequency: 'daily',
      };
      mockMedicationService.update.mockResolvedValue(result);

      expect(await controller.update(1, dto)).toEqual(result);
      expect(mockMedicationService.update).toHaveBeenCalledWith(1, dto);
    });
  });
});
