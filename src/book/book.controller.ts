import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Req,
    Res,
    UploadedFile, UseInterceptors,
    Param,
} from '@nestjs/common'
import { BookService } from './book.service'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { UpdateBook } from './DTO/Update.dto'
import { FileInterceptor } from '@nestjs/platform-express/multer'
import { diskStorage } from 'multer'
import * as fs from 'fs'
import * as path from 'path'

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
    @ApiBearerAuth()
    @Post('upload')
    @ApiOperation({ summary: 'Загрузить книгу ' })
    @ApiResponse({ status: 200, description: '' })
    @ApiResponse({ status: 401, description: 'Ошибка токена' })
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: 'src/uploads', // Папка для сохранения загруженных файлов
                filename: (req, file, cb) => {
                    console.log(111)

                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
                    cb(null, `${uniqueSuffix}-${file.originalname}`)
                },
            }),
        })
    )
    uploadFile(@Body() body: UpdateBook, @UploadedFile() file, @Res() res: Response) {
        return this.bookServise.getFilename(body.id, file, res)
    }
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Загрузить книгу себе ' })
    @ApiResponse({ status: 200, description: '' })
    @ApiResponse({ status: 401, description: 'Ошибка токена' })
    @Get('file/:filename')
    async downloadBook(@Param('filename') filename: string, @Res() res: Response) {
        const filePath = path.join('src/', 'uploads', filename)
        console.log(filePath)
        if (!fs.existsSync(filePath)) {
            return res.status(404).send('File not found')
        }
        res.setHeader('Content-Type', 'application/octet-stream')
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
        fs.createReadStream(filePath).pipe(res)
    }
}
