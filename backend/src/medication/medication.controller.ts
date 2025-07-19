import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { MedicationService } from './medication.service';
import { MedicationEntity } from './medication.entity';
import { CreateMedicationDto, MedicationDto } from './medication.dto';

@Controller('medications')
export class MedicationController {
  constructor(private readonly service: MedicationService) {}

  @Post()
  create(@Body() dto: CreateMedicationDto): Promise<MedicationDto> {
    return this.service.create(dto);
  }

  @Get()
  findAll(
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<MedicationDto[]> {
    return this.service.findAll(limit, offset);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<MedicationDto> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<MedicationEntity>,
  ): Promise<MedicationDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
