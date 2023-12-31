import { Module, OnModuleDestroy } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthPhoneEntity } from 'src/entities/AuthPhone.entity'

import 'dotenv/config'
import { TokenEntity } from 'src/entities/Tokens.entity'
import { Connection } from 'typeorm'
import { configuration } from 'src/config/configuration'
import { ConfigModule } from '@nestjs/config'
import { Book } from 'src/entities/Book.entity'
import { Genre } from 'src/entities/Genre.entity'
import { Author } from 'src/entities/Author.entity'
import typeorm from 'src/config/typeorm'
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `${process.cwd()}/src/config/env/${process.env.NODE_ENV}.env`,
            load: [configuration, typeorm],
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: parseInt(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DBNAME,
            entities: [AuthPhoneEntity, TokenEntity, Author, Book, Genre],
            synchronize: true,
            autoLoadEntities: true,
        }),
    ],
})
export class PostgresModule implements OnModuleDestroy {
    constructor(private readonly connection: Connection) {}

    async onModuleDestroy() {
        console.log('Connection was closed')
        await this.connection.close()
    }
}
