import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { AuthPhoneEntity } from './entities/AuthPhone.entity'
import { PostgresModule } from './postgres/postgres.module'
import { TokenEntity } from './entities/Tokens.entity'
import { AccessTokenMiddleware } from './middleware/access.middleware'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from './user/user.module'
import { ResponceGeneratorModule } from './others/responce-generator/responce-generator.module'
import { UserController } from './user/user.controller'
import { AuthController } from './auth/auth.controller'
import { RateLimitMiddleware } from './middleware/rate-limit.middleware'
import { ResponceGeneratorService } from './others/responce-generator/responce-generator.service'
import { Author } from './entities/Author.entity'
import { Book } from './entities/Book.entity'
import { Genre } from './entities/Genre.entity'

@Module({
    imports: [
        PostgresModule,
        AuthModule,
        TypeOrmModule.forFeature([AuthPhoneEntity, TokenEntity, Author, Book, Genre]),
        JwtModule.register({
            secret: process.env.jwt_secret,
        }),
        UserModule,
        ResponceGeneratorModule,
    ],
    providers: [ResponceGeneratorService],
    controllers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AccessTokenMiddleware).forRoutes(UserController),
            consumer
                .apply(RateLimitMiddleware)
                .exclude({ path: 'auth', method: RequestMethod.ALL }, 'auth/code', 'auth/update')
                .forRoutes(AuthController)
    }
}
