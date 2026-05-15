import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAntibioticDto } from './dto/create-antibiotic.dto';
import { UpdateAntibioticDto } from './dto/update-antibiotic.dto';
import { AntibioticCategory, AntibioticForm } from '@prisma/client';

@Injectable()
export class AntibioticsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateAntibioticDto) {
    return this.prisma.antibiotic.create({ data: dto });
  }

  async findAll(
    search?: string,
    categories?: AntibioticCategory[],
    form?: AntibioticForm,
    page = 1,
    limit = 10,
  ) {
    const where = {
      ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
      ...(categories?.length && { category: { in: categories } }),
      ...(form && { form }),
    };

    const [data, total] = await Promise.all([
      this.prisma.antibiotic.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.antibiotic.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const antibiotic = await this.prisma.antibiotic.findUnique({ where: { id } });
    if (!antibiotic) throw new NotFoundException('Antibiotik tidak ditemukan');
    return antibiotic;
  }

  async update(id: string, dto: UpdateAntibioticDto) {
    await this.findOne(id);
    return this.prisma.antibiotic.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.antibiotic.delete({ where: { id } });
  }
}
