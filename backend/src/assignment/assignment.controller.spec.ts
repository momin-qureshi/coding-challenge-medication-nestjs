import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './assignment.dto';

describe('AssignmentController', () => {
  let controller: AssignmentController;

  const mockAssignmentService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignmentController],
      providers: [
        {
          provide: AssignmentService,
          useValue: mockAssignmentService,
        },
      ],
    }).compile();

    controller = module.get<AssignmentController>(AssignmentController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an assignment', async () => {
      const dto: CreateAssignmentDto = {
        patientId: 1,
        medicationId: 2,
        startDate: '2023-01-01',
        totalDays: 30,
      };

      const result = {
        id: 1,
        patient: { id: 1 },
        medication: {
          id: 2,
          name: 'Test Medication',
          dosage: '10mg',
          frequency: 'daily',
        },
        startDate: new Date('2023-01-01'),
        days: 30,
      };

      mockAssignmentService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(mockAssignmentService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of assignments', async () => {
      const result = [
        {
          id: 1,
          patientId: 1,
          medication: {
            id: 2,
            name: 'Test Medication',
            dosage: '10mg',
            frequency: 'daily',
          },
          startDate: '2023-01-01',
          totalDays: 30,
          remainingDays: 15,
        },
      ];
      mockAssignmentService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(mockAssignmentService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single assignment', async () => {
      const result = {
        id: 1,
        patientId: 1,
        medication: {
          id: 2,
          name: 'Test Medication',
          dosage: '10mg',
          frequency: 'daily',
        },
        startDate: '2023-01-01',
        totalDays: 30,
        remainingDays: 15,
      };
      mockAssignmentService.findOne.mockResolvedValue(result);

      expect(await controller.findOne(1)).toEqual(result);
      expect(mockAssignmentService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update an assignment', async () => {
      const dto = { totalDays: 45 };
      const result = {
        id: 1,
        patientId: 1,
        medication: {
          id: 2,
          name: 'Test Medication',
          dosage: '10mg',
          frequency: 'daily',
        },
        startDate: '2023-01-01',
        totalDays: 45,
        remainingDays: 30,
      };
      mockAssignmentService.update.mockResolvedValue(result);

      expect(await controller.update(1, dto)).toEqual(result);
      expect(mockAssignmentService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should return deleted: true when successfully deleted', async () => {
      mockAssignmentService.remove.mockResolvedValue({ deleted: true });

      expect(await controller.remove(1)).toEqual({ deleted: true });
      expect(mockAssignmentService.remove).toHaveBeenCalledWith(1);
    });
  });
});
