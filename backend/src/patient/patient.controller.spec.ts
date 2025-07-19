import { Test, TestingModule } from '@nestjs/testing';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './patient.dto';
import { PatientEntity } from './patient.entity';

describe('PatientController', () => {
  let controller: PatientController;

  const mockPatientService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientController],
      providers: [
        {
          provide: PatientService,
          useValue: mockPatientService,
        },
      ],
    }).compile();

    controller = module.get<PatientController>(PatientController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should convert date string to Date object and call service.create', async () => {
      const dto: CreatePatientDto = {
        name: 'Test Patient',
        dateOfBirth: '2000-01-01',
      };

      const patientEntity: PatientEntity = {
        id: 1,
        name: 'Test Patient',
        dateOfBirth: new Date('2000-01-01'),
        assignments: [],
      };

      mockPatientService.create.mockResolvedValue(patientEntity);

      await controller.create(dto);

      expect(mockPatientService.create).toHaveBeenCalledWith({
        ...dto,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        dateOfBirth: expect.any(Date),
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of patients', async () => {
      const result = {
        data: [
          {
            id: 1,
            name: 'Test Patient',
            dateOfBirth: new Date('2000-01-01'),
            assignments: [],
          },
        ],
        total: 1,
      };
      mockPatientService.findAll.mockResolvedValue(result);

      expect(await controller.findAll(false, 10, 0)).toEqual(result.data);
      expect(mockPatientService.findAll).toHaveBeenCalledWith(false, 10, 0);
    });
  });

  describe('findOne', () => {
    it('should return a single patient', async () => {
      const result = {
        id: 1,
        name: 'Test Patient',
        dateOfBirth: '2000-01-01',
        assignments: [],
      };
      mockPatientService.findOne.mockResolvedValue(result);

      expect(await controller.findOne(1)).toEqual(result);
      expect(mockPatientService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a patient', async () => {
      const dto = { name: 'Updated Patient' };
      const result = {
        id: 1,
        name: 'Updated Patient',
        dateOfBirth: '2000-01-01',
        assignments: [],
      };
      mockPatientService.update.mockResolvedValue(result);

      expect(await controller.update(1, dto)).toEqual(result);
      expect(mockPatientService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should return deleted: true when successfully deleted', async () => {
      mockPatientService.remove.mockResolvedValue(undefined);

      expect(await controller.remove(1)).toEqual({ deleted: true });
      expect(mockPatientService.remove).toHaveBeenCalledWith(1);
    });

    it('should return deleted: false when deletion fails', async () => {
      mockPatientService.remove.mockRejectedValue(new Error('Not found'));

      expect(await controller.remove(1)).toEqual({ deleted: false });
      expect(mockPatientService.remove).toHaveBeenCalledWith(1);
    });
  });
});
