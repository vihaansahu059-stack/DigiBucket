import serverModule from "../../dist/server/server.js";

const resolveServer = (mod) => {
  if (mod?.fetch) return mod;
  if (mod?.default?.fetch) return mod.default;
  if (mod?.default?.default?.fetch) return mod.default.default;
  throw new Error(
    `Unable to resolve server fetch from module. keys=${JSON.stringify(Object.keys(mod || {}))}`,
  );
};

const server = resolveServer(serverModule);

const buildRequest = (event) => {
  const host = event.headers?.host ?? "localhost";
  const query = event.rawUrl?.includes("?") ? event.rawUrl.split("?")[1] : "";
  const url = new URL(`https://${host}${event.path}${query ? `?${query}` : ""}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(event.headers || {})) {
    if (Array.isArray(value)) {
      value.forEach((headerValue) => headers.append(key, headerValue));
    } else if (value !== undefined) {
      headers.append(key, value);
    }
  }

  return new Request(url.toString(), {
    method: event.httpMethod,
    headers,
    body: event.body ? Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8") : null,
  });
};

export const handler = async (event) => {
  const request = buildRequest(event);
  const response = await server.fetch(request, undefined, undefined);
  const body = await response.arrayBuffer();

  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: Buffer.from(body).toString("base64"),
    isBase64Encoded: true,
  };
};