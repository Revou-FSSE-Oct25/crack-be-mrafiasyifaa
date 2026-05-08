import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AntibioticsService } from './antibiotics.service';
import { CreateAntibioticDto } from './dto/create-antibiotic.dto';
import { UpdateAntibioticDto } from './dto/update-antibiotic.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('antibiotics')
export class AntibioticsController {
  constructor(private readonly antibioticsService: AntibioticsService) {}

  @Post()
  @Roles(Role.ADMIN_VPRS)
  create(@Body() dto: CreateAntibioticDto) {
    return this.antibioticsService.create(dto);
  }

  @Get()
  findAll() {
    return this.antibioticsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.antibioticsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN_VPRS)
  update(@Param('id') id: string, @Body() dto: UpdateAntibioticDto) {
    return this.antibioticsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN_VPRS)
  remove(@Param('id') id: string) {
    return this.antibioticsService.remove(id);
  }
}
