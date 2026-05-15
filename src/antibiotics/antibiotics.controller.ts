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
  ParseIntPipe,
  DefaultValuePipe,
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
  @ApiOperation({ summary: 'Lihat semua antibiotik (A-Z) dengan filter dan paginasi' })
  @ApiQuery({ name: 'search', required: false, description: 'Cari berdasarkan nama' })
  @ApiQuery({ name: 'category', enum: AntibioticCategory, isArray: true, required: false, description: 'Filter kategori (bisa pilih lebih dari satu)' })
  @ApiQuery({ name: 'form', enum: AntibioticForm, required: false })
  @ApiQuery({ name: 'page', required: false, description: 'Halaman (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Item per halaman (default: 10)' })
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: AntibioticCategory | AntibioticCategory[],
    @Query('form') form?: AntibioticForm,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    const categories = category
      ? (Array.isArray(category) ? category : [category])
      : [];
    return this.antibioticsService.findAll(search, categories, form, page, limit);
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
