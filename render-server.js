import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createServer } from 'node:http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serverModule = await import('./dist/server/server.js');
const server = serverModule?.default?.fetch ? serverModule.default : serverModule;

const PORT = process.env.PORT || 3000;

const httpServer = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const request = new Request(url.toString(), {
      method: req.method,
      headers: req.headers,
      body: req.readable ? req : null,
    });

    const response = await server.fetch(request, undefined, undefined);
    res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
    const body = await response.arrayBuffer();
    res.end(Buffer.from(body));
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

httpServer.listen(PORT, () => {
  console.log(`Render server listening on port ${PORT}`);
});