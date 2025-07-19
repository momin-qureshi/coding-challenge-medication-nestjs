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
  ParseBoolPipe,
} from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentDto, CreateAssignmentDto } from './assignment.dto';

@Controller('assignments')
export class AssignmentController {
  constructor(private readonly service: AssignmentService) {}

  @Get()
  findAll(
    @Query('patientId') patientId?: number,
    @Query('active', new DefaultValuePipe(false), ParseBoolPipe)
    active?: boolean,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ): Promise<AssignmentDto[]> {
    return this.service.findAll(patientId, active, limit, offset);
  }

  @Post()
  create(@Body() body: CreateAssignmentDto): Promise<AssignmentDto> {
    return this.service.create(body);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<AssignmentDto> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: Partial<{
      medicationId: number;
      startDate: string;
      totalDays: number;
    }>,
  ): Promise<AssignmentDto> {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
