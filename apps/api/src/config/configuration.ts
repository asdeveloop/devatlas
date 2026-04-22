export default () => ({
  app: {
    port: parseInt(process.env['PORT'] ?? '3001', 10),
    env: process.env['NODE_ENV'] ?? 'development',
    corsOrigin: process.env['CORS_ORIGIN'] ?? 'http://localhost:3000',
  },
  database: {
    url: process.env['DATABASE_URL'],
  },
});
