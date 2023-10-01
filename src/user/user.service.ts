import { Injectable } from '@nestjs/common'
import { Response } from 'express'
import { UpdateRequest } from './DTO/UpdateRequestt.dto'
import { ResponceGeneratorService } from 'src/others/responce-generator/responce-generator.service'
import { FieldError } from 'src/others/DTO/FieldEror.dto'
import { Author } from 'src/entities/Author.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Book } from 'src/entities/Book.entity'
import { isValidUUIDV4 } from 'is-valid-uuid-v4'
import { TokenEntity } from 'src/entities/Tokens.entity'
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Author)
        private authorRepo: Repository<Author>,
        @InjectRepository(Book)
        private bookRepo: Repository<Book>,
        @InjectRepository(TokenEntity)
        private tokenRepo: Repository<TokenEntity>,
        private masterResponce: ResponceGeneratorService
    ) { }

    async deleteUser(req: Request, res: Response) {
        const userId = String(req.headers['userId'])
        const author = await this.authorRepo.findOneBy({ id: userId })

        if (author) {
            await this.authorRepo.delete(author)
            const tokens = await this.tokenRepo.findOneBy({ userId: userId })
            await this.tokenRepo.delete(tokens)
            return this.masterResponce.sendOK(res, {})
        } else {
            return this.masterResponce.sendERROR(res, 'Пользователь не найден')
        }
    }
    async getUserResponser(req: Request, res: Response) {
        const userId = String(req.headers['userId'])
        return this.getUserLogic(res, userId)
    }
    private async getUserLogic(res: Response, userId: string) {
        const author = await this.authorRepo.findOne({
            where: { id: userId },
            relations: { books: true },
        })

        if (author) {
            return this.masterResponce.sendOK(res, author)
        } else {
            return this.masterResponce.sendERROR(res, 'Пользователь не найден')
        }
    }
    async validationUser(res: Response, data: UpdateRequest) {
        const isEmailCorrect = await this.validateEmail(data.email)
        const isNameCorrect = await this.validateName(data.name)
        const isBirthdayCorrect = await this.validateBirhday(data.birthday)

        const fields: FieldError[] = []

        if (!isEmailCorrect || !isNameCorrect || !isBirthdayCorrect) {
            if (!isEmailCorrect) {
                fields.push(new FieldError('email', 'Электронная почта не верна'))
            }
            if (!isNameCorrect) {
                fields.push(new FieldError('name', 'Неправильный формат имени'))
            }
            if (!isBirthdayCorrect) {
                fields.push(new FieldError('birthday', 'Неправильный формат даты'))
            }
            return this.masterResponce.sendFildERROR(res, fields)
        }
        return true
    }

    async updateDataResponser(body: UpdateRequest, req: Request, res: Response) {
        const validation = await this.validationUser(res, body)

        if (validation) {
            const userId = String(req.headers['userId'])
            return this.updateDataLogic(res, userId, body)
        }
    }
    private async updateAuthor(author: Author, data: UpdateRequest) {
        if (data.name) {
            author.name = data.name
        }
        if (data.email) {
            author.email = data.email
        }
        if (data.birthday) {
            author.birthday = data.birthday
        }
        if (data.books) {
            const newBooks = await this.bookRepo.findByIds(data.books)
            author.books = newBooks
        }
        return this.authorRepo.save(author)
    }

    private async updateDataLogic(res: Response, userId: string, body: UpdateRequest) {
        if (body.books) {
            for (const book of body.books) {
                if (!isValidUUIDV4(book)) {
                    return this.masterResponce.sendERROR(res, 'uuid не читается')
                }
            }
        }
        const author = await this.authorRepo.findOneBy({ id: userId })
        if (author) {
            await this.updateAuthor(author, body)
        }
        const authorUpdated = await this.authorRepo.findOne({
            where: { id: userId },
            relations: { books: true },
        })

        if (author) {
            return this.masterResponce.sendOK(res, authorUpdated)
        } else {
            return this.masterResponce.sendERROR(res, 'ошибка')
        }
    }

    async validateEmail(email: string): Promise<boolean> {
        if (email == null) {
            return true
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        return emailRegex.test(email)
    }
    async validateName(name: string) {
        if (name == null) {
            return true
        }
        if (!name || name.trim().length === 0) {
            return false
        }
        const nameRegex = /^[A-Za-zА-Яа-я\s]+$/

        return nameRegex.test(name)
    }

    async validateBirhday(birthday: Date | string) {
        if (birthday == null) {
            return true
        }

        let birthdayStr: string

        if (typeof birthday === 'string') {
            // Преобразовать строку в объект Date
            const date = new Date(birthday)
            if (isNaN(date.getTime())) {
                // Если преобразование не удалось, вернуть ошибку
                return false
            }
            // Преобразовать объект Date в нужный формат строки
            birthdayStr = date.toISOString()
        } else if (birthday instanceof Date) {
            // Если birthday уже объект Date, преобразовать его в нужный формат строки
            birthdayStr = birthday.toISOString()
        } else {
            // Неправильный формат даты
            return false
        }

        const birthdayRegex =
            /^(\d{4}-\d{2}-\d{2}|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z)$/
        const check = birthdayRegex.test(birthdayStr)
        if (!check) {
            return false
        } else {
            return true
        }
    }
    async getOrCreateUser(phone: string) {
        let author: Author = await this.authorRepo.findOneBy({ phone: phone })
        if (!author) {
            author = await this.createAuthor(phone)
        }
        return author.id
    }
    async createAuthor(phone: string): Promise<Author> {
        const author = await this.authorRepo.save(
            this.authorRepo.create({
                phone: phone,
            })
        )
        return author
    }
}
