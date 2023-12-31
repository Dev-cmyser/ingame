import { DataSource } from 'typeorm'

export const configuration = () => ({
    NODE_ENV: process.env.NODE_ENV,
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    },
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DBNAME,
})
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
