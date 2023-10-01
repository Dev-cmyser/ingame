import { Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { PostgresModule } from 'src/postgres/postgres.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TokenEntity } from 'src/entities/Tokens.entity'
import { AccessTokenMiddleware } from './access.middleware'
import { ResponceGeneratorModule } from 'src/others/responce-generator/responce-generator.module'

@Module({
    controllers: [],
    providers: [AccessTokenMiddleware, JwtService],
    imports: [
        ResponceGeneratorModule,
        PostgresModule,
        TypeOrmModule.forFeature([TokenEntity]),
        JwtModule,
        ResponceGeneratorModule,
    ],
})
export class AuthModule {}
