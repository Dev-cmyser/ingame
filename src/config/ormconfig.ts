import { Injectable } from '@nestjs/common'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import 'dotenv/config'

@Injectable()
class ConfigService {}

export const connectionSource = new DataSource({
    type: 'postgres',

    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),

    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DBNAME,

    entities: ['{dist, src}/**/*.entity.{ts, js}'],
    // migrationsTableName: 'operation',

    migrations: ['src/migration/*.ts'],
    synchronize: false,
})
