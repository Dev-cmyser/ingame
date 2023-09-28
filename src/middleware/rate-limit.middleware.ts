import { Injectable, NestMiddleware } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Request, Response, NextFunction } from 'express'
import { AuthPhoneEntity } from 'src/entities/AuthPhone.entity'
import { Repository } from 'typeorm'

import { ResponceGeneratorService } from 'src/others/responce-generator/responce-generator.service'
import { RateLimit } from 'src/auth/DTO/RateLimit.dto'
@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
    constructor(
        @InjectRepository(AuthPhoneEntity)
        private authPhoneRepo: Repository<AuthPhoneEntity>,
        private masterResponce: ResponceGeneratorService
    ) { }

    async findAuthPhone(phone: string) {
        return this.authPhoneRepo.find({
            where: {
                phone: phone,
            },
        })
    }
    compareOperations(first, second) {
        return first.createDateTime - second.createDateTime
    }
    async use(req: Request, res: Response, next: NextFunction) {
        const now = new Date()
        const authPhoneRepo = await this.findAuthPhone(req.body.phone)
        authPhoneRepo.sort(this.compareOperations)
        if (authPhoneRepo.length != 0) {
            const lastAuthPhone = authPhoneRepo[authPhoneRepo.length - 1]
            const timeDifference = now.getTime() - lastAuthPhone.createDateTime.getTime()
            const secondsDifference = Math.abs(timeDifference / 1000)
            // need 60 !
            const isDifferenceGreaterThan5Seconds = secondsDifference > 60
            if (isDifferenceGreaterThan5Seconds) {
                next()
            } else {
                const reSecond = Math.round(Math.abs(secondsDifference - 61))
                const message = `Подождите еще ${reSecond} секунд для следующего запроса`
                return this.masterResponce.sendERROR(res, message, new RateLimit(reSecond), 408)
            }
        } else {
            next()
        }
    }
}
