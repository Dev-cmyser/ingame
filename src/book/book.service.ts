import { Injectable } from '@nestjs/common'
import { Response } from 'express'
import { InjectRepository } from '@nestjs/typeorm'
import { Author } from 'src/entities/Author.entity'
import { Book } from 'src/entities/Book.entity'
import { Genre } from 'src/entities/Genre.entity'
import { ResponceGeneratorService } from 'src/others/responce-generator/responce-generator.service'
import { Repository } from 'typeorm'
import { isValidUUIDV4 } from 'is-valid-uuid-v4'
import { UpdateBook } from './DTO/Update.dto'
import { FieldError } from 'src/others/DTO/FieldEror.dto'

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Author)
        private authorRepo: Repository<Author>,
        @InjectRepository(Book)
        private bookRepo: Repository<Book>,
        @InjectRepository(Genre)
        private genreRepo: Repository<Genre>,
        private masterResponce: ResponceGeneratorService
    ) { }
    async getGenresResponser(res: Response) {
        const genres = await this.genreRepo.find({
            select: { id: true, name: true },
            relations: { books: true },
        })
        if (genres.length != 0) {
            return this.masterResponce.sendOK(res, genres)
        } else {
            return this.masterResponce.sendERROR(res, 'ошибка')
        }
    }
    async getBooksResponser(res: Response) {
        const books = await this.bookRepo.find({
            select: { id: true, name: true, redaction: true },
            relations: { genres: true, authors: true },
        })
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
        const book = await this.bookRepo.find({
            where: { id: id },
            relations: { genres: true, authors: true },
        })
        if (book) {
            return this.masterResponce.sendOK(res, book)
        } else {
            return this.masterResponce.sendERROR(res, 'ошибка')
        }
    }
    async deleteBook(id: string, res: Response) {
        if (!isValidUUIDV4(id)) {
            return this.masterResponce.sendERROR(res, 'uuid не читается')
        }
        await this.bookRepo.delete(id)
        return this.masterResponce.sendOK(res, {})
    }
    async validateString(name: string) {
        if (name == null) {
            return true
        }
        if (!name || name.trim().length === 0) {
            return false
        }
        const nameRegex = /^[A-Za-zА-Яа-я\s]+$/

        return nameRegex.test(name)
    }

    async validateDate(year: Date | string) {
        if (year == null) {
            return true
        }

        let birthdayStr: string

        if (typeof year === 'string') {
            // Преобразовать строку в объект Date
            const date = new Date(year)
            if (isNaN(date.getTime())) {
                // Если преобразование не удалось, вернуть ошибку
                return false
            }
            // Преобразовать объект Date в нужный формат строки
            birthdayStr = date.toISOString()
        } else if (year instanceof Date) {
            // Если birthday уже объект Date, преобразовать его в нужный формат строки
            birthdayStr = year.toISOString()
        } else {
            // Неправильный формат даты
            return false
        }

        const dateRegex = /^(\d{4}-\d{2}-\d{2}|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z)$/
        const check = dateRegex.test(birthdayStr)
        if (!check) {
            return false
        } else {
            return true
        }
    }
    async validationBook(res: Response, data: UpdateBook) {
        const isRedactionCorrect = await this.validateString(data.redaction)
        const isNameCorrect = await this.validateString(data.name)
        const isYearCorrect = await this.validateDate(data.year)
        const isIdCorrect = isValidUUIDV4(data.id)

        const fields: FieldError[] = []

        if (!isRedactionCorrect || !isNameCorrect || !isYearCorrect || !isIdCorrect) {
            if (!isRedactionCorrect) {
                fields.push(new FieldError('redaction', 'Неправильный формат'))
            }
            if (!isNameCorrect) {
                fields.push(new FieldError('name', 'Неправильный формат имени'))
            }
            if (!isYearCorrect) {
                fields.push(new FieldError('year', 'Неправильный формат даты'))
            }
            if (!isIdCorrect) {
                fields.push(new FieldError('id', 'Неправильный формат '))
            }
            return this.masterResponce.sendFildERROR(res, fields)
        }
        return true
    }
    async updateDataResponser(body: UpdateBook, res: Response) {
        const validation = await this.validationBook(res, body)

        if (validation) {
            return this.updateDataLogic(res, body)
        }
    }
    private async updateDataLogic(res: Response, body: UpdateBook) {
        if (body.authors) {
            for (const author of body.authors) {
                if (!isValidUUIDV4(author)) {
                    return this.masterResponce.sendERROR(res, 'uuid не читается')
                }
            }
        }
        if (body.genres) {
            for (const genre of body.genres) {
                if (!isValidUUIDV4(genre)) {
                    return this.masterResponce.sendERROR(res, 'uuid не читается')
                }
            }
        }
        const book = await this.bookRepo.findOneBy({ id: body.id })
        if (book) {
            await this.updateBook(book, body)
        }
        const bookUpdated = await this.bookRepo.findOne({
            where: { id: body.id },
            relations: { authors: true, genres: true },
        })

        if (book) {
            return this.masterResponce.sendOK(res, bookUpdated)
        } else {
            return this.masterResponce.sendERROR(res, 'ошибка')
        }
    }
    private async updateBook(book: Book, data: UpdateBook) {
        if (data.name) {
            book.name = data.name
        }
        if (data.year) {
            book.year = data.year
        }
        if (data.redaction) {
            book.redaction = data.redaction
        }
        if (data.authors) {
            const newAuthors = await this.authorRepo.findByIds(data.authors)
            book.authors = newAuthors
        }
        if (data.genres) {
            const newGenres = await this.genreRepo.findByIds(data.genres)
            book.genres = newGenres
        }
        return await this.bookRepo.save(book)
    }
}
