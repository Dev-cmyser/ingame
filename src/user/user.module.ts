import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { ResponceGeneratorModule } from 'src/others/responce-generator/responce-generator.module'
import { PostgresModule } from 'src/postgres/postgres.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthPhoneEntity } from 'src/entities/AuthPhone.entity'
import { TokenEntity } from 'src/entities/Tokens.entity'
import { Author } from 'src/entities/Author.entity'
import { Book } from 'src/entities/Book.entity'
import { Genre } from 'src/entities/Genre.entity'

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [
        PostgresModule,
        TypeOrmModule.forFeature([AuthPhoneEntity, TokenEntity, Author, Book, Genre]),
        ResponceGeneratorModule,
    ],
})
export class UserModule {}
