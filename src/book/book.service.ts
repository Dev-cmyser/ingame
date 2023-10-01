import { Injectable } from '@nestjs/common'
import { Response } from 'express'
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from 'src/entities/Author.entity';
import { Book } from 'src/entities/Book.entity';
import { Genre } from 'src/entities/Genre.entity';
import { ResponceGeneratorService } from 'src/others/responce-generator/responce-generator.service';
import { Repository } from 'typeorm';
import { isValidUUIDV4 } from 'is-valid-uuid-v4';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Author)
        private authorRepo: Repository<Author>,
        @InjectRepository(Book)
        private bookRepo: Repository<Book>,
        @InjectRepository(Genre)
        private tokenRepo: Repository<Genre>,
        private masterResponce: ResponceGeneratorService
    ) { }
    async getBooksResponser(res: Response) {
        const books = await this.bookRepo.find({ select: { id: true, name: true, redaction: true }, relations: { genres: true, authors: true } })
        if (books.length != 0) {
            return this.masterResponce.sendOK(res, books)
        } else {
            return this.masterResponce.sendERROR(res, 'ошибка')
        }

    }
    async getBookResponser(id: string, res: Response) {
        if (!isValidUUIDV4(id)) {
            return this.masterResponce.sendERROR(res, 'uuid не читается')
        }
        return await this.getBookLogic(id, res)
    }
    private async getBookLogic(id: string, res: Response) {
        const book = await this.bookRepo.find({ where: { id: id }, relations: { genres: true, authors: true } })
        if (book) {
            return this.masterResponce.sendOK(res, book)
        } else {
            return this.masterResponce.sendERROR(res, 'ошибка')
        }
    }
}
