import serverModule from '../dist/server/server.js';

const resolveServer = (mod) => {
  if (mod?.fetch) return mod;
  if (mod?.default?.fetch) return mod.default;
  if (mod?.default?.default?.fetch) return mod.default.default;
  throw new Error(`Unable to resolve server fetch from module. keys=${JSON.stringify(Object.keys(mod || {}))}`);
};

const server = resolveServer(serverModule);

const buildRequest = (req) => {
  const host = req.headers.host || 'localhost';
  const url = new URL(req.url || '/', `https://${host}`);
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers || {})) {
    if (Array.isArray(value)) {
      value.forEach((headerValue) => headers.append(key, headerValue));
    } else if (value !== undefined) {
      headers.append(key, String(value));
    }
  }

  const body = req.method === 'GET' || req.method === 'HEAD' ? null : req;
  return new Request(url.toString(), {
    method: req.method,
    headers,
    body,
  });
};

const pipeResponse = async (res, response) => {
  res.status(response.status);
  for (const [key, value] of response.headers.entries()) {
    if (key.toLowerCase() === 'transfer-encoding') continue;
    res.setHeader(key, value);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  res.send(buffer);
};

export default async function handler(req, res) {
  try {
    const request = buildRequest(req);
    const response = await server.fetch(request, undefined, undefined);
    await pipeResponse(res, response);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}
