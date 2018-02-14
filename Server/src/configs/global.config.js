module.exports = {
    api42Endpoint: 'https://api.intra.42.fr/',
    redirect_uri: 'http://localhost:8080/token/',
    name: '101_PROJECTS',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8080,
    base_url: process.env.BASE_URL || 'http://localhost:8080',
    debug: true,
};
