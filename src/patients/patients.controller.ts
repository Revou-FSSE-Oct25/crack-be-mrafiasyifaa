import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PatientCondition } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { AssignPatientDto } from './dto/assign-patient.dto';
import { UpdateConditionDto } from './dto/update-condition.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Patients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: '[DOCTOR] Daftarkan pasien baru dengan medRecNo auto-generated' })
  create(@CurrentUser() user: any, @Body() dto: CreatePatientDto) {
    return this.patientsService.create(user.id, dto);
  }

  @Post('assign')
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: '[DOCTOR] Assign pasien existing ke diri sendiri via No. RM' })
  assignExisting(@CurrentUser() user: any, @Body() dto: AssignPatientDto) {
    return this.patientsService.assignExisting(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lihat daftar pasien dengan filter opsional (Doctor: milik sendiri | Admin: semua)' })
  @ApiQuery({ name: 'search', required: false, description: 'Cari berdasarkan nama atau No. RM' })
  @ApiQuery({ name: 'condition', enum: PatientCondition, required: false })
  findAll(
    @CurrentUser() user: any,
    @Query('search') search?: string,
    @Query('condition') condition?: PatientCondition,
  ) {
    return this.patientsService.findAll(user.id, user.role, search, condition);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail pasien + 10 log kondisi terbaru' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.patientsService.findOne(id, user.id, user.role);
  }

  @Patch(':id/condition')
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: '[DOCTOR] Update kondisi pasien — otomatis membuat condition log' })
  updateCondition(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateConditionDto,
  ) {
    return this.patientsService.updateCondition(id, user.id, dto);
  }

  @Get(':id/condition-logs')
  @ApiOperation({ summary: 'Riwayat perubahan kondisi pasien (journey)' })
  getConditionLogs(@Param('id') id: string, @CurrentUser() user: any) {
    return this.patientsService.getConditionLogs(id, user.id, user.role);
  }
}
