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
} from '@nestjs/common';
import { AntibioticCategory, AntibioticForm } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AntibioticsService } from './antibiotics.service';
import { CreateAntibioticDto } from './dto/create-antibiotic.dto';
import { UpdateAntibioticDto } from './dto/update-antibiotic.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Antibiotics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('antibiotics')
export class AntibioticsController {
  constructor(private readonly antibioticsService: AntibioticsService) {}

  @Post()
  @Roles(Role.ADMIN_PPRA)
  @ApiOperation({ summary: '[ADMIN] Tambah antibiotik baru' })
  create(@Body() dto: CreateAntibioticDto) {
    return this.antibioticsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lihat semua antibiotik (A-Z) dengan filter opsional' })
  @ApiQuery({ name: 'search', required: false, description: 'Cari berdasarkan nama' })
  @ApiQuery({ name: 'category', enum: AntibioticCategory, required: false })
  @ApiQuery({ name: 'form', enum: AntibioticForm, required: false })
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: AntibioticCategory,
    @Query('form') form?: AntibioticForm,
  ) {
    return this.antibioticsService.findAll(search, category, form);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail antibiotik' })
  findOne(@Param('id') id: string) {
    return this.antibioticsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN_PPRA)
  @ApiOperation({ summary: '[ADMIN] Update data antibiotik (semua field opsional)' })
  update(@Param('id') id: string, @Body() dto: UpdateAntibioticDto) {
    return this.antibioticsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN_PPRA)
  @ApiOperation({ summary: '[ADMIN] Hapus antibiotik' })
  remove(@Param('id') id: string) {
    return this.antibioticsService.remove(id);
  }
}
