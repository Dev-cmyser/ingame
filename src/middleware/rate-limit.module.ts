import { Module } from '@nestjs/common'
import { PostgresModule } from 'src/postgres/postgres.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ResponceGeneratorModule } from 'src/others/responce-generator/responce-generator.module'
import { RateLimitMiddleware } from './rate-limit.middleware'
import { AuthPhoneEntity } from 'src/entities/AuthPhone.entity'
import { ResponceGeneratorService } from 'src/others/responce-generator/responce-generator.service'

@Module({
    controllers: [],
    providers: [RateLimitMiddleware, ResponceGeneratorService],
    imports: [ResponceGeneratorModule, PostgresModule, TypeOrmModule.forFeature([AuthPhoneEntity])],
})
export class RateLimitModule {}
