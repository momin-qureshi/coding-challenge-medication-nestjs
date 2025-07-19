import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientEntity } from './patient.entity';
import {
  PatientDto,
  toPatientDto,
  DeleteDto,
  CreatePatientDto,
} from './patient.dto';

@Controller('patients')
export class PatientController {
  constructor(private readonly service: PatientService) {}

  @Post()
  create(@Body() dto: CreatePatientDto): Promise<PatientDto> {
    const data: Partial<PatientEntity> = {
      ...dto,
      dateOfBirth: new Date(dto.dateOfBirth),
    };
    return this.service.create(data).then((patient) => toPatientDto(patient));
  }

  @Get()
  findAll(
    @Query('includeAssignments', new DefaultValuePipe(false), ParseBoolPipe)
    includeAssignments: boolean,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<PatientDto[]> {
    return this.service
      .findAll(includeAssignments, limit, offset)
      .then(({ data }) => {
        return data;
      });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PatientDto> {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<PatientEntity>,
  ): Promise<PatientDto> {
    return this.service.update(id, dto).then((patient) => {
      return toPatientDto(patient);
    });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteDto> {
    return this.service
      .remove(id)
      .then(() => {
        return { deleted: true };
      })
      .catch(() => {
        return { deleted: false };
      });
  }
}
