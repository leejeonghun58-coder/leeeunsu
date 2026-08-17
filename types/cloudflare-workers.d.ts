declare module "cloudflare:workers" {
  export const env: any;
}

type Fetcher = { fetch(request: Request): Promise<Response> };
interface D1Database { prepare(query: string): unknown; }
