import { Controller, Get, Post, Query, Req, Res } from '@nestjs/common'
import { BookService } from './book.service'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

@ApiTags('Book')
@Controller('book')
export class BookController {
    constructor(private readonly bookServise: BookService) { }

    @ApiBearerAuth()
    @Get('get')
    @ApiOperation({ summary: 'Получить все книги' })
    @ApiResponse({ status: 200, description: '' })
    @ApiResponse({ status: 401, description: 'Ошибка токена' })
    getBooks(@Res() res: Response) {
        return this.bookServise.getBooksResponser(res)
    }
    @ApiBearerAuth()
    @Get('getOne')
    @ApiOperation({ summary: 'Получить книгу по id' })
    @ApiResponse({ status: 200, description: '' })
    @ApiResponse({ status: 401, description: 'Ошибка токена' })
    getBook(@Query('id') id: string, @Res() res: Response) {
        return this.bookServise.getBookResponser(id, res)
    }

    // @ApiBearerAuth()
    // @Post('update')
    // @ApiOperation({ summary: 'Обновить поля пользователя' })
    // @ApiResponse({ status: 200, description: '' })
    // @ApiResponse({ status: 401, description: 'Ошибка токена' })
    // updateData(@Body() body: UpdateRequest, @Req() req: Request, @Res() res: Response) {
    //     return this.userServise.updateDataResponser(body, req, res)
    // }
    // @ApiBearerAuth()
    // @Get('delete')
    // @ApiOperation({ summary: 'Удалить пользователя !!!' })
    // @ApiResponse({ status: 200, description: '' })
    // @ApiResponse({ status: 401, description: 'Ошибка токена' })
    // deleteUser(@Req() req: Request, @Res() res: Response) {
    //     return this.userServise.deleteUser(req, res)
    // }
}
