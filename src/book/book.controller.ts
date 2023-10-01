import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common'
import { BookService } from './book.service'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { UpdateBook } from './DTO/Update.dto'

@ApiTags('Book')
@Controller('book')
export class BookController {
    constructor(private readonly bookServise: BookService) { }

    @ApiBearerAuth()
    @Get('getGenres')
    @ApiOperation({ summary: 'Получить все жанры' })
    @ApiResponse({ status: 200, description: '' })
    @ApiResponse({ status: 401, description: 'Ошибка токена' })
    getGenres(@Res() res: Response) {
        return this.bookServise.getGenresResponser(res)
    }
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

    @ApiBearerAuth()
    @Post('update')
    @ApiOperation({ summary: 'Обновить данные книги' })
    @ApiResponse({ status: 200, description: '' })
    @ApiResponse({ status: 401, description: 'Ошибка токена' })
    updateData(@Body() body: UpdateBook, @Res() res: Response) {
        return this.bookServise.updateDataResponser(body, res)
    }
    @ApiBearerAuth()
    @Get('delete')
    @ApiOperation({ summary: 'Удалить книгу !!!' })
    @ApiResponse({ status: 200, description: '' })
    @ApiResponse({ status: 401, description: 'Ошибка токена' })
    deleteUser(@Query('id') id: string, @Res() res: Response) {
        return this.bookServise.deleteBook(id, res)
    }
}
