import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { AntibioticRequestsService } from './antibiotic-requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ReviewRequestDto } from './dto/review-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { RequestStatus } from '@prisma/client';

@ApiTags('Antibiotic Requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('antibiotic-requests')
export class AntibioticRequestsController {
  constructor(private readonly service: AntibioticRequestsService) {}

  @Post()
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: '[DOCTOR] Buat request antibiotik beserta clinical data' })
  create(@CurrentUser() user: any, @Body() dto: CreateRequestDto) {
    return this.service.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lihat request (Doctor: milik sendiri | Admin: semua). Filter via query params.' })
  @ApiQuery({ name: 'status', enum: ['PENDING', 'APPROVED', 'REJECTED'], required: false })
  @ApiQuery({ name: 'unclaimed', type: Boolean, required: false, description: 'Khusus Admin: tampilkan hanya request yang belum di-claim' })
  @ApiQuery({ name: 'patientId', required: false, description: 'Filter request berdasarkan pasien' })
  findAll(
    @CurrentUser() user: any,
    @Query('status') status?: RequestStatus,
    @Query('unclaimed') unclaimed?: string,
    @Query('patientId') patientId?: string,
  ) {
    return this.service.findAll(user.id, user.role, status, unclaimed === 'true', patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail request beserta clinical data lengkap' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.findOne(id, user.id, user.role);
  }

  @Patch(':id')
  @Roles(Role.DOCTOR)
  @ApiOperation({ summary: '[DOCTOR] Edit request — hanya jika status masih PENDING' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateRequestDto,
  ) {
    return this.service.update(id, user.id, dto);
  }

  @Delete(':id')
  @Roles(Role.DOCTOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '[DOCTOR] Hapus request — hanya jika status masih PENDING' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.remove(id, user.id);
  }

  @Patch(':id/claim')
  @Roles(Role.ADMIN_PPRA)
  @ApiOperation({ summary: '[ADMIN] Claim request dari pool untuk direview' })
  claim(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.claim(id, user.id);
  }

  @Patch(':id/unclaim')
  @Roles(Role.ADMIN_PPRA)
  @ApiOperation({ summary: '[ADMIN] Lepas claim — kembalikan request ke pool' })
  unclaim(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.unclaim(id, user.id);
  }

  @Patch(':id/review')
  @Roles(Role.ADMIN_PPRA)
  @ApiOperation({ summary: '[ADMIN] Approve atau reject request (harus claim dulu)' })
  review(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: ReviewRequestDto,
  ) {
    return this.service.review(id, user.id, dto);
  }
}
