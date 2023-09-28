import { Injectable } from '@nestjs/common'
import { AuthPhone } from './DTO/AuthPhone.dto'
import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import 'dotenv/config'
import { UpdateTokens } from './DTO/UpdateTokens.dto'
import { AuthPhoneEntity } from 'src/entities/AuthPhone.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ResponseTokens } from './DTO/ResponseTokens.dto'
import { ResponseOperationId } from './DTO/ResponseOperationId.dto'
import { AuthCode } from './DTO/AuthCode.dto'
import { TokenEntity } from 'src/entities/Tokens.entity'
import { UserService } from 'src/user/user.service'
import { createCode, getUserData } from './utils/auth.utils'
import { ResponceGeneratorService } from 'src/others/responce-generator/responce-generator.service'
import { FieldError } from 'src/others/DTO/FieldEror.dto'
import { isValidUUIDV4 } from 'is-valid-uuid-v4'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthPhoneEntity)
        private authPhoneRepo: Repository<AuthPhoneEntity>,
        @InjectRepository(TokenEntity)
        private tokenRepo: Repository<TokenEntity>,
        private jwtService: JwtService,
        private userService: UserService,
        private masterResponce: ResponceGeneratorService
    ) { }

    async phoneResponser(body: AuthPhone, res: Response) {
        const typeLogin = body.typeLogin
        const phone = body.phone

        if ((await this.isPhoneValid(phone)) != '') {
            const fields: FieldError[] = []
            fields.push(new FieldError('phone', await this.isPhoneValid(phone)))
            return this.masterResponce.sendFildERROR(res, fields)
        }
        return await this.phoneLogic(res, typeLogin, phone)
    }

    private async phoneLogic(res: Response, typeLogin: string, phone: string) {
        const code = createCode()
        const authPhone = await this.saveAuthPhone(code, phone)

        if (typeLogin == 'CALL') {
            const data = new ResponseOperationId(authPhone.id, code)
            return this.masterResponce.sendOK(res, data)
        } else if (typeLogin == 'SMS') {
            const data = new ResponseOperationId(authPhone.id, code)
            return this.masterResponce.sendOK(res, data)
        } else {
            return this.masterResponce.sendERROR(res, 'неверный тип логина')
        }
    }

    async codeResponser(body: AuthCode, res: Response) {
        const code = body.code
        const operationId = body.operationId
        if (!isValidUUIDV4(operationId)) {
            return this.masterResponce.sendERROR(res, 'uuid не читается')
        }

        return this.codeLogic(res, code, operationId)
    }

    private async codeLogic(res: Response, code: string, operationId: string) {
        const authPhone = await this.findAuthPhone(operationId, code)

        if (authPhone && code == authPhone.code) {
            // const userId = await this.userService.getOrCreateUserId(authPhone.phone)
            // await this.checkOldTokens(userId)
            // const tokens = this.createTokens(userId)
            // await this.saveTokens(tokens.refreshToken, tokens.accessToken, userId)
            // await this.authPhoneRepo.remove(authPhone)
            // return this.masterResponce.sendOK(res, tokens)
            return this.masterResponce.sendOK(res, {})
        } else {
            const fields: FieldError[] = []
            fields.push(new FieldError('code', 'неверный код'))
            return this.masterResponce.sendFildERROR(res, fields)
        }
    }

    async checkOldTokens(userId: string) {

        const tokens = await this.tokenRepo.findOneBy({ userId: userId })
        console.log(tokens)
        if (tokens != null) { await this.tokenRepo.delete(tokens.id) }
    }
    async updateTokensResponser(body: UpdateTokens, res: Response) {
        const refreshToken = body.refreshToken

        return await this.updateTokensLogic(res, refreshToken)
    }

    private async updateTokensLogic(res: Response, refreshToken: string) {
        const tokens = await this.getTokens(refreshToken)

        if (tokens.length != 0) {
            const tokensResponce = this.createTokens(tokens[0].userId)

            tokens[0].refreshToken = tokensResponce.refreshToken
            tokens[0].accessToken = tokensResponce.accessToken
            await this.tokenRepo.save(tokens[0])
            return this.masterResponce.sendOK(res, tokensResponce)
        } else {
            return this.masterResponce.sendERROR(res, 'токен не найден', 401)
        }
    }

    async findAuthPhone(operationId: string, code: string) {
        return await this.authPhoneRepo.findOne({
            where: {
                id: operationId,
                code: code,
            },
        })
    }

    async saveAuthPhone(code: string, phone: string) {
        const authPhone = await this.authPhoneRepo.save(
            this.authPhoneRepo.create({
                code: code,
                phone: phone,
            })
        )
        return authPhone
    }

    async saveTokens(refreshToken: string, accessToken: string, userId: string) {
        const token = await this.tokenRepo.save(
            this.tokenRepo.create({
                refreshToken: refreshToken,
                accessToken: accessToken,
                userId: userId,
            })
        )
        return token
    }

    async getTokens(refreshToken: string) {
        return await this.tokenRepo.find({
            where: {
                refreshToken: refreshToken,
            },
        })
    }

    createTokens(userId: string): ResponseTokens {
        const data = getUserData(userId)
        // console.log(this.configService.get<string>('jwt_secret'))
        // console.log(process.env.JWT_SECRET)
        const accessToken = this.jwtService.sign(data, {
            secret: process.env.JWT_SECRET,
            privateKey: process.env.JWT_SECRET,
            expiresIn: process.env.ACCESS_JWT_EXPIRES_IN,
        })
        // console.log(accessToken, 111111)
        const refreshToken = this.jwtService.sign(data, {
            secret: process.env.JWT_SECRET,
            privateKey: process.env.JWT_SECRET,
            expiresIn: '15638400s',
        })
        return new ResponseTokens(accessToken, refreshToken)
    }

    private async isPhoneValid(phone: string): Promise<string> {
        let resp = ''
        if (phone.length != 12) {
            resp = 'Телефон должен состоять из 12 символов'
        } else if (phone.slice(0, 2) != '+7') {
            resp = 'Телефон должен начинаться с +7'
        } else if (isNaN(+phone.replace('+7', ''))) {
            resp = 'Телефон должен состоять из чисел'
        }

        return resp
    }
}
