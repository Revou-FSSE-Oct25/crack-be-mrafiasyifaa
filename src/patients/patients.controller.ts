import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { AssignPatientDto } from './dto/assign-patient.dto';
import { UpdateConditionDto } from './dto/update-condition.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @Roles(Role.DOCTOR)
  create(@CurrentUser() user: any, @Body() dto: CreatePatientDto) {
    return this.patientsService.create(user.id, dto);
  }

  @Post('assign')
  @Roles(Role.DOCTOR)
  assignExisting(@CurrentUser() user: any, @Body() dto: AssignPatientDto) {
    return this.patientsService.assignExisting(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.patientsService.findAll(user.id, user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.patientsService.findOne(id, user.id, user.role);
  }

  @Patch(':id/condition')
  @Roles(Role.DOCTOR)
  updateCondition(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateConditionDto,
  ) {
    return this.patientsService.updateCondition(id, user.id, dto);
  }

  @Get(':id/condition-logs')
  getConditionLogs(@Param('id') id: string, @CurrentUser() user: any) {
    return this.patientsService.getConditionLogs(id, user.id, user.role);
  }
}
