import { Controller, Post, Body, Res, HttpStatus, Req } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { Response } from 'express'
import { AuthPhone } from './DTO/AuthPhone.dto'
import { UpdateTokens } from './DTO/UpdateTokens.dto'
import { AuthCode } from './DTO/AuthCode.dto'
import { ResponseOperationId } from './DTO/ResponseOperationId.dto'
import { ResponseTokens } from './DTO/ResponseTokens.dto'
@ApiTags('Authtorization')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('phone')
    @ApiOperation({
        summary: 'Отправка телефона - Значения для typeLogin: SMS/CALL',
    })
    @ApiResponse({ status: 200, description: 'code: только для тестов', type: ResponseOperationId })
    @ApiResponse({ status: 400, description: 'Ошибки форм' })
    @ApiResponse({
        status: 408,
        description: 'Повторите запрос позже. reSecond: таймаут до следующего запроса',
    })
    phone(@Body() body: AuthPhone, @Res() res: Response) {
        // console.log(body)
        return this.authService.phoneResponser(body, res)
    }

    @Post('code')
    @ApiOperation({
        summary:
            'Проверить правильность кода - При правильном коде создается новый пользователь ( или находиться )',
    })
    @ApiResponse({ status: 200, description: '', type: ResponseTokens })
    @ApiResponse({ status: 400, description: '' })
    code(@Body() body: AuthCode, @Res() res: Response) {
        return this.authService.codeResponser(body, res)
    }

    @Post('update')
    @ApiOperation({
        summary: 'обновить токены',
    })
    @ApiResponse({ status: 200, description: '', type: ResponseTokens })
    @ApiResponse({ status: 400, description: '' })
    updateTokens(@Body() body: UpdateTokens, @Res() res: Response) {
        // console.log(body)
        return this.authService.updateTokensResponser(body, res)
    }
}
