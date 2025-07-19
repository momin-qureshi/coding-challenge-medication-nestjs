import { validate } from 'class-validator';
import { CreateAssignmentDto } from './assignment.dto';

describe('CreateAssignmentDto', () => {
  it('should validate with correct data', async () => {
    const dto = new CreateAssignmentDto();
    dto.patientId = 1;
    dto.medicationId = 2;
    dto.startDate = '2023-01-01';
    dto.totalDays = 30;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with missing patientId', async () => {
    const dto = new CreateAssignmentDto();
    dto.medicationId = 2;
    dto.startDate = '2023-01-01';
    dto.totalDays = 30;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('patientId');
  });

  it('should fail validation with missing medicationId', async () => {
    const dto = new CreateAssignmentDto();
    dto.patientId = 1;
    dto.startDate = '2023-01-01';
    dto.totalDays = 30;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('medicationId');
  });

  it('should fail validation with negative patientId', async () => {
    const dto = new CreateAssignmentDto();
    dto.patientId = -1;
    dto.medicationId = 2;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('patientId');
  });

  it('should fail validation with negative medicationId', async () => {
    const dto = new CreateAssignmentDto();
    dto.patientId = 1;
    dto.medicationId = -2;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('medicationId');
  });

  it('should fail validation with invalid date format', async () => {
    const dto = new CreateAssignmentDto();
    dto.patientId = 1;
    dto.medicationId = 2;
    dto.startDate = 'invalid-date';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('startDate');
  });

  it('should fail validation with negative totalDays', async () => {
    const dto = new CreateAssignmentDto();
    dto.patientId = 1;
    dto.medicationId = 2;
    dto.startDate = '2023-01-01';
    dto.totalDays = -5;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('totalDays');
  });
});
