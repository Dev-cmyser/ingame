import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common'
import { UserService } from './user.service'
import { Response } from 'express'
import { UpdateRequest } from './DTO/UpdateRequest.dto'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userServise: UserService) {}

    @ApiBearerAuth()
    @Get('get')
    @ApiOperation({ summary: 'Получить пользователя' })
    @ApiResponse({ status: 200, description: '' })
    @ApiResponse({ status: 401, description: 'Ошибка токена' })
    getData(@Req() req: Request, @Res() res: Response) {
        return this.userServise.getUserResponser(req, res)
    }

    @ApiBearerAuth()
    @Post('update')
    @ApiOperation({ summary: 'Обновить поля пользователя' })
    @ApiResponse({ status: 200, description: '' })
    @ApiResponse({ status: 401, description: 'Ошибка токена' })
    updateData(@Body() body: UpdateRequest, @Req() req: Request, @Res() res: Response) {
        return this.userServise.updateDataResponser(body, req, res)
    }
    @ApiBearerAuth()
    @Get('delete')
    @ApiOperation({ summary: 'Удалить пользователя !!!' })
    @ApiResponse({ status: 200, description: '' })
    @ApiResponse({ status: 401, description: 'Ошибка токена' })
    deleteUser(@Req() req: Request, @Res() res: Response) {
        return this.userServise.deleteUser(req, res)
    }
}
