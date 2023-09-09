import { DataSourceOptions } from "typeorm";

export interface FileStorageConfig {
    local: boolean;
    dir: string;
}

export interface ConnectionConfig {
    host: string;
    port: string;
}

const helperConfig: () => ConnectionConfig = () => ({
    host: process.env.HELPER_HOST,
    port: process.env.HELPER_PORT
});
const s2tConfig: () => ConnectionConfig = () => ({
    host: process.env.RECOGNITION_HOST,
    port: process.env.RECOGNITION_PORT
});
const t2sConfig: () => ConnectionConfig = () => ({
    host: process.env.T2S_HOST,
    port: process.env.T2S_PORT
});
const fileStorageConfig: () => FileStorageConfig = () => ({
    local: process.env.FILE_STORAGE_LOCAL == 'true',
    dir: process.env.FILE_STORAGE_DIR
});
const dbConfig = (): DataSourceOptions => ({
    type: 'postgres',
    dropSchema: false,
    synchronize: true,
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
    port: parseInt(process.env.PORT, 10) || 3000,
    bot: helperConfig(),
    t2s: t2sConfig(),
    s2t: s2tConfig(),
    fileStorage: fileStorageConfig(),
    db: dbConfig()
});