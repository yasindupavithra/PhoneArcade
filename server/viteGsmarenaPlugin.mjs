import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { fetchFromGsmarena, fetchProductPage } = require('./gsmarenaScraper.cjs');

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export function gsmarenaApiPlugin() {
  return {
    name: 'gsmarena-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];

        if (url !== '/api/gsmarena/fetch' && url !== '/api/gsmarena/product') {
          return next();
        }

        if (req.method !== 'POST') {
          sendJson(res, 405, { error: 'Method not allowed' });
          return;
        }

        try {
          const body = await readJsonBody(req);
          const brand = body.brand || '';
          const name = body.name || '';
          const query = [brand, name].filter(Boolean).join(' ').trim() || name;

          if (url === '/api/gsmarena/product') {
            const href = body.href;
            if (!href) {
              sendJson(res, 400, { error: 'href is required' });
              return;
            }
            const data = await fetchProductPage(href);
            sendJson(res, 200, { ok: true, ...data });
            return;
          }

          const data = await fetchFromGsmarena(query, { href: body.href });
          sendJson(res, 200, { ok: true, ...data });
        } catch (err) {
          const status = err.response?.status === 429 ? 429 : 500;
          sendJson(res, status, {
            ok: false,
            error: err.message || 'Failed to fetch GSMArena data',
          });
        }
      });
    },
  };
}
