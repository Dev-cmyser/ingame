import { Injectable, NestMiddleware } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Request, Response, NextFunction } from 'express'
import { TokenEntity } from 'src/entities/Tokens.entity'
import { ResponceGeneratorService } from 'src/others/responce-generator/responce-generator.service'
import { Repository } from 'typeorm'

import 'dotenv/config'
@Injectable() // реф респонсов
export class AccessTokenMiddleware implements NestMiddleware {
    constructor(
        @InjectRepository(TokenEntity)
        private tokenRepo: Repository<TokenEntity>,
        private jwtService: JwtService,
        private masterResponce: ResponceGeneratorService
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {
        let authorization: string

        if (req.headers.authorization) {
            authorization = req.headers.authorization.split(' ')[1]
        } else {
            authorization = ''
        }
        const tokens = await this.findTokens(authorization)

        if (tokens) {
            try {
                await this.jwtService.verify(authorization, {
                    secret: process.env.JWT_SECRET,
                })
                req.headers.userId = tokens.userId
                next()
            } catch (err) {
                console.log(err)
                return this.masterResponce.sendERROR(res, 'токен не действителен', {}, 401)
            }
        } else {
            return this.masterResponce.sendERROR(res, 'токен не найден', {}, 401)
        }
    }

    async findTokens(authorization: string) {
        return this.tokenRepo.findOneBy({
            accessToken: authorization,
        })
    }
}
