import { createServer } from 'node:http';

const port = Number(process.env.PORT || 4000);
const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
);

const server = createServer((request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);

  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'DENY');
  response.setHeader('Referrer-Policy', 'no-referrer');
  response.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");

  const origin = request.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Vary', 'Origin');
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method === 'GET' && url.pathname === '/api/health') {
    response.writeHead(200);
    response.end(JSON.stringify({ status: 'ok', service: 'horizon-capital-api' }));
    return;
  }

  response.writeHead(404);
  response.end(JSON.stringify({ error: 'Not found' }));
});

server.on('error', (error) => {
  console.error('HorizonCapital API server failed:', error);
  process.exitCode = 1;
});

server.listen(port, '0.0.0.0', () => {
  console.log(`HorizonCapital API listening on http://0.0.0.0:${port}`);
});
