import { Injectable, Global } from '@nestjs/common'
import { ServiceReply } from '../DTO/ServiceReply.dto'
import { GlobalReply } from '../DTO/GlobalReply.dto'
import { Response } from 'express'
import { Meta } from '../DTO/Meta.dto'
import { FieldError } from '../DTO/FieldEror.dto'

@Global()
@Injectable()
export class ResponceGeneratorService {
    public createResponse(data: object, message = 'ok', status = 200) {
        const resp = new ServiceReply(data, status, message)
        return resp
    }

    public createError(data: object, status = 500, message = 'Что то пошло не так') {
        const resp = new ServiceReply(data, status, message)
        // console.log(resp)
        return resp
    }

    public sendOK(res: Response, data: any) {
        const responce = new GlobalReply()
        responce.data = data
        responce.meta = new Meta()

        res.status(200).json(responce)
        return responce
    }

    public sendERROR(res: Response, message: string, data = {}, status = 400) {
        const response = new GlobalReply()
        response.data = data
        response.meta = new Meta(message)

        res.status(status).json(response)
        return response
    }

    public sendFildERROR(res: Response, fields: FieldError[], message = 'FieldsError', data = {}) {
        const response = new GlobalReply()
        response.data = data
        const meta = new Meta(message)
        meta.fieldErrors = fields
        response.meta = meta

        res.status(400).json(response)
        return response
    }
}
