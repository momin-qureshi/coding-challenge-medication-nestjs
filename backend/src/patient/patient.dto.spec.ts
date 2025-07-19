import { validate } from 'class-validator';
import { CreatePatientDto } from './patient.dto';

describe('CreatePatientDto', () => {
  it('should validate with correct data', async () => {
    const dto = new CreatePatientDto();
    dto.name = 'Test Patient';
    dto.dateOfBirth = '2000-01-01';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with empty name', async () => {
    const dto = new CreatePatientDto();
    dto.name = '';
    dto.dateOfBirth = '2000-01-01';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('should fail validation with missing name', async () => {
    const dto = new CreatePatientDto();
    dto.dateOfBirth = '2000-01-01';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('should fail validation with invalid date format', async () => {
    const dto = new CreatePatientDto();
    dto.name = 'Test Patient';
    dto.dateOfBirth = 'invalid-date';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('dateOfBirth');
  });

  it('should fail validation with missing dateOfBirth', async () => {
    const dto = new CreatePatientDto();
    dto.name = 'Test Patient';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('dateOfBirth');
  });
});
