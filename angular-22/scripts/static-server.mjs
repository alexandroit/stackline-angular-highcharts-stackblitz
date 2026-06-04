import { createServer } from 'node:http';
import { createReadStream, promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const staticDir = path.join(rootDir, 'stackblitz-static');

const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8']
]);

function isInside(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function decodePathname(rawUrl) {
  const url = new URL(rawUrl || '/', 'http://stackline.local');

  try {
    return decodeURIComponent(url.pathname);
  } catch {
    return '/';
  }
}

async function fileExists(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
}

async function resolveFile(requestPath) {
  const normalizedPath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(staticDir, normalizedPath);

  if (!isInside(staticDir, filePath)) {
    filePath = path.join(staticDir, 'index.html');
  }

  const stats = await fs.stat(filePath).catch(() => null);

  if (stats?.isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (await fileExists(filePath)) {
    return filePath;
  }

  return path.join(staticDir, 'index.html');
}

async function sendFile(request, response, filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes.get(extension) || 'application/octet-stream';
  const stats = await fs.stat(filePath);

  response.writeHead(200, {
    'Cache-Control': 'no-store',
    'Content-Length': stats.size,
    'Content-Type': contentType
  });

  if (request.method === 'HEAD') {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
}

export function serveStatic(options = {}) {
  const host = options.host || process.env.HOST || '0.0.0.0';
  const port = Number(options.port || process.env.PORT || 4200);

  const server = createServer(async (request, response) => {
    if (!['GET', 'HEAD'].includes(request.method || 'GET')) {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      response.end();
      return;
    }

    try {
      const requestPath = decodePathname(request.url);
      const filePath = await resolveFile(requestPath);

      await sendFile(request, response, filePath);
    } catch (error) {
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(error instanceof Error ? error.message : String(error));
    }
  });

  server.listen(port, host, () => {
    console.log(`[stackline] Static StackBlitz preview running at http://${host}:${port}/`);
  });

  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  serveStatic();
}
