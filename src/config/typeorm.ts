import { registerAs } from '@nestjs/config'
import { config as dotenvConfig } from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'

dotenvConfig({ path: '.env' })

const config = {
    type: 'postgres',
    host: `${process.env.POSTGRES_HOST}`,
    port: parseInt(process.env.POSTGRES_PORT),
    username: `${process.env.POSTGRES_USER}`,
    password: `${process.env.POSTGRES_PASSWORD}`,
    database: `${process.env.POSTGRES_DBNAME}`,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    autoLoadEntities: true,
    synchronize: false,
}

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions)