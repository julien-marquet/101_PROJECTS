module.exports = {
    api42Endpoint: 'https://api.intra.42.fr/',
    redirectUri: 'http://localhost:8080/session/',
    name: '101_PROJECTS',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8080,
    baseUrl: process.env.BASE_URL || 'http://localhost:8080',
    debug: true,
};
