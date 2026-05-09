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
import { ApiTags, ApiBearerAuth, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { AntibioticRequestsService } from './antibiotic-requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ReviewRequestDto } from './dto/review-request.dto';
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
  findAll(
    @CurrentUser() user: any,
    @Query('status') status?: RequestStatus,
    @Query('unclaimed') unclaimed?: string,
  ) {
    return this.service.findAll(user.id, user.role, status, unclaimed === 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail request beserta clinical data lengkap' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.findOne(id, user.id, user.role);
  }

  @Patch(':id/claim')
  @Roles(Role.ADMIN_VPRS)
  @ApiOperation({ summary: '[ADMIN] Claim request dari pool untuk direview' })
  claim(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.claim(id, user.id);
  }

  @Patch(':id/unclaim')
  @Roles(Role.ADMIN_VPRS)
  @ApiOperation({ summary: '[ADMIN] Lepas claim — kembalikan request ke pool' })
  unclaim(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.unclaim(id, user.id);
  }

  @Patch(':id/review')
  @Roles(Role.ADMIN_VPRS)
  @ApiOperation({ summary: '[ADMIN] Approve atau reject request (harus claim dulu)' })
  review(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: ReviewRequestDto,
  ) {
    return this.service.review(id, user.id, dto);
  }
}
