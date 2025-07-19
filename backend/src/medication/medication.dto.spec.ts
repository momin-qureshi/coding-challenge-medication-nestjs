import { validate } from 'class-validator';
import { CreateMedicationDto } from './medication.dto';

describe('CreateMedicationDto', () => {
  it('should validate with correct data', async () => {
    const dto = new CreateMedicationDto();
    dto.name = 'Test Medication';
    dto.dosage = '10mg';
    dto.frequency = 'daily';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with missing name', async () => {
    const dto = new CreateMedicationDto();
    dto.dosage = '10mg';
    dto.frequency = 'daily';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
  });

  it('should fail validation with non-string dosage', async () => {
    const dto = new CreateMedicationDto();
    dto.name = 'Test Medication';
    dto.frequency = 'daily';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
  });

  it('should fail validation with non-string frequency', async () => {
    const dto = new CreateMedicationDto();
    dto.name = 'Test Medication';
    dto.dosage = '10mg';

    const errors = await validate(dto);
    expect(errors.length).toBe(1);
  });
});
