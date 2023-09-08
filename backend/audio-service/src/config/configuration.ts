const helperConfig = () => ({
    host: process.env.HELPER_HOST
});
const s2tConfig = () => ({
    host: process.env.S2T_HOST
});
const t2sConfig = () => ({
    host: process.env.T2S_HOST
});
export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    helperConfig: helperConfig(),
    t2sConfig: t2sConfig(),
    s2tConfig: s2tConfig()
});