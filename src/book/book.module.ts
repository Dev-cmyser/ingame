import { Module } from '@nestjs/common'
import { BookController } from './book.controller'
import { BookService } from './book.service'
import { PostgresModule } from 'src/postgres/postgres.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ResponceGeneratorModule } from 'src/others/responce-generator/responce-generator.module'
import { Author } from 'src/entities/Author.entity'
import { Book } from 'src/entities/Book.entity'
import { Genre } from 'src/entities/Genre.entity'

@Module({
    controllers: [BookController],
    providers: [BookService],
    imports: [
        PostgresModule,
        TypeOrmModule.forFeature([Author, Book, Genre]),
        ResponceGeneratorModule,
    ],
})
export class BookModule { }
