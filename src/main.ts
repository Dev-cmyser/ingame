import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(new ValidationPipe())

    const config = new DocumentBuilder()
        .setTitle('API')
        .setDescription('The sv.ru API description')
        .setVersion('1.0')
        .addServer('http://localhost:80')
        .addServer('https://codovstvo-test.ru/gateway')
        .addBearerAuth({
            // I was also testing it without prefix 'Bearer ' before the JWT
            description: `[just text field] Please enter token in following format: Bearer <JWT>`,
            name: 'Authorization',
            bearerFormat: '', // I`ve tested not to use this field, but the result was the same
            scheme: 'Bearer',
            type: 'http', // I`ve attempted type: 'apiKey' too
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
            // Закрываем соединение с базой данных
            await app.close()
        } catch (error) {
            console.error('Произошла ошибка при закрытии соединения с базой данных:', error)
        }

        // Завершаем приложение
        process.exit()
    })
    await app.listen(80) //80
}
bootstrap()
