import { Module } from '@nestjs/common';
import { ResponceGeneratorService } from './responce-generator.service';

@Module({
  providers: [ResponceGeneratorService],
  exports: [ResponceGeneratorService]
})
export class ResponceGeneratorModule { }
