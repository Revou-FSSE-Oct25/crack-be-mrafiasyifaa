import { PartialType } from '@nestjs/swagger';
import { CreateAntibioticDto } from './create-antibiotic.dto';

export class UpdateAntibioticDto extends PartialType(CreateAntibioticDto) {}
