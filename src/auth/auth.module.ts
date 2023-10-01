import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

import { AuthPhoneEntity } from 'src/entities/AuthPhone.entity'
import { TokenEntity } from 'src/entities/Tokens.entity'
import { UserModule } from 'src/user/user.module'
import { UserService } from 'src/user/user.service'
import { ResponceGeneratorModule } from 'src/others/responce-generator/responce-generator.module'
import { ConfigModule } from '@nestjs/config'

import { JwtModule, JwtService } from '@nestjs/jwt'
import 'dotenv/config'
import { PostgresModule } from 'src/postgres/postgres.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { configuration } from 'src/config/configuration'
import { Author } from 'src/entities/Author.entity'
import { Book } from 'src/entities/Book.entity'
import { Genre } from 'src/entities/Genre.entity'

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtService, UserService],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `${process.cwd()}/src/config/env/${process.env.NODE_ENV}.env`,

            load: [configuration],
            isGlobal: true,
        }),
        ResponceGeneratorModule,
        UserModule,
        PostgresModule,
        TypeOrmModule.forFeature([AuthPhoneEntity, TokenEntity, Author, Book, Genre]),
        JwtModule.register({
            secret: process.env.jwt_secret,
        }),
    ],
})
export class AuthModule {}
