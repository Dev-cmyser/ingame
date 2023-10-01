import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as dotenv from 'dotenv'
async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(new ValidationPipe())
    const config = new DocumentBuilder()
        .setTitle('API')
        .setDescription('The sv.ru API description')
        .setVersion('1.0')
        .addServer('http://localhost:8080')
        .addServer('http://todotaskmaster.space')
        .addBearerAuth({
            description: `Please enter token in following format: Bearer <JWT>`,
            name: 'Authorization',
            bearerFormat: '',
            scheme: 'Bearer',
            type: 'http',
            in: 'Header',
        })
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('doc', app, document)
    // Обработчик для SIGINT (Ctrl+C)
    process.on('SIGINT', async () => {
        console.log(
            'Приложение получило сигнал SIGINT (Ctrl+C). Закрываем соединение с базой данных и завершаем приложение.'
        )
        try {
            await app.close()
        } catch (error) {
            console.error('Произошла ошибка при закрытии соединения с базой данных:', error)
        }
        process.exit()
    })
    await app.listen(process.env.PORT)
}
bootstrap()
