import { Injectable } from '@nestjs/common'
import { Response } from 'express'
import { UpdateRequest } from './DTO/UpdateRequestt.dto'
import { ResponceGeneratorService } from 'src/others/responce-generator/responce-generator.service'
import { FieldError } from 'src/others/DTO/FieldEror.dto'
@Injectable()
export class UserService {
    constructor(private masterResponce: ResponceGeneratorService) { }

    async getUserResponser(req: Request, res: Response) {
        const userId = String(req.headers['userId'])

        // validation here
        //
        //
        return this.getUserLogic(res, userId)
    }
    private async getUserLogic(res: Response, userId: string) {
        const resp = { status: 200 } // database
        if (resp.status == 200) {
            return this.masterResponce.sendOK(res, {})
        } else {
            return this.masterResponce.sendERROR(res, 'Пользователь не найден')
        }
    }
    async validationUser(res: Response, data: UpdateRequest) {
        const isEmailCorrect = await this.validateEmail(data.email)
        const isNameCorrect = await this.validateName(data.name)
        const isBirthdayCorrect = await this.validateBirhday(data.birthDay)

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

    private async updateDataLogic(res: Response, userId: string, body: UpdateRequest) {
        const resp = { status: 200 } // to database

        if (resp.status == 200) {
            return this.masterResponce.sendOK(res, {})
        } else {
            return this.masterResponce.sendERROR(res, 'Внутренняя ошибка')
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
}
