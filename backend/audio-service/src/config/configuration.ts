export interface FileStorageConfig {
    local: boolean;
    dir: string;
}

const helperConfig = () => ({
    host: process.env.HELPER_HOST,
    port: process.env.HELPER_PORT
});
const s2tConfig = () => ({
    host: process.env.S2T_HOST,
    port: process.env.S2T_PORT
});
const t2sConfig = () => ({
    host: process.env.T2S_HOST,
    port: process.env.T2S_PORT
});
const fileStorageConfig: () => FileStorageConfig = () => ({
    local: process.env.FILE_STORAGE_LOCAL == 'true',
    dir: process.env.FILE_STORAGE_DIR
})
export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    helperConfig: helperConfig(),
    t2s: t2sConfig(),
    s2t: s2tConfig(),
    fileStorage: fileStorageConfig()
});