import { DataSourceOptions } from 'typeorm';

const dbConfig = (): DataSourceOptions => ({
    type: 'postgres',
    dropSchema: false,
    synchronize: false,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    schema: process.env.DB_SCHEMA,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    migrations: [__dirname + '/../db/migrations/**/*{.ts,.js}'],
  });

export default () => ({
    port: parseInt(process.env.PORT, 10) || 3001,
    db: dbConfig(),
});