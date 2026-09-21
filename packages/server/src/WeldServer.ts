import type { ZodSchema } from 'zod'
import type {
  HttpMethod,
  RouteDefinition,
  RouteHandler,
  WeldServerConfig,
} from './types.js'
import { createRequestHandler } from './handler.js'

// ─── Router type builder ──────────────────────────────────────────────────────
// Each call to get/post/put/patch/delete intersects a new path+method into
// the router type, enabling full E2E type safety between server and client.

type AddRoute<
  TRouter extends Record<string, unknown>,
  TPath extends string,
  TMethod extends string,
  TResponse,
  TBody = never,
> = Omit<TRouter, TPath> & {
  [K in TPath]: (K extends keyof TRouter ? TRouter[K] : Record<string, never>) & {
    [M in TMethod]: {
      response: TResponse
    } & ([TBody] extends [never] ? Record<string, never> : { body: TBody })
  }
}

// ─── WeldServer ───────────────────────────────────────────────────────────────

export class WeldServer<TRouter extends Record<string, unknown> = Record<string, never>> {
  private _routes: RouteDefinition[] = []
  private config:  WeldServerConfig

  /**
   * The router type — export this to share types with the frontend.
   *
   * Usage:
   *   export type AppRouter = typeof server.router
   */
  declare readonly router: TRouter

  constructor(config: WeldServerConfig = {}) {
    this.config = { port: 3000, cors: true, ...config }
  }

  get<TPath extends string, TResponse = unknown>(
    path: TPath,
    schema: ZodSchema<TResponse>,
    handler: RouteHandler<never, TResponse>,
  ): WeldServer<AddRoute<TRouter, TPath, 'GET', TResponse>> {
    return this._addRoute('GET', path, schema, handler as RouteHandler<unknown, unknown>) as unknown as
      WeldServer<AddRoute<TRouter, TPath, 'GET', TResponse>>
  }

  post<TPath extends string, TBody = unknown, TResponse = unknown>(
    path: TPath,
    schema: ZodSchema<TResponse>,
    handler: RouteHandler<TBody, TResponse>,
  ): WeldServer<AddRoute<TRouter, TPath, 'POST', TResponse, TBody>> {
    return this._addRoute('POST', path, schema, handler as RouteHandler<unknown, unknown>) as unknown as
      WeldServer<AddRoute<TRouter, TPath, 'POST', TResponse, TBody>>
  }

  put<TPath extends string, TBody = unknown, TResponse = unknown>(
    path: TPath,
    schema: ZodSchema<TResponse>,
    handler: RouteHandler<TBody, TResponse>,
  ): WeldServer<AddRoute<TRouter, TPath, 'PUT', TResponse, TBody>> {
    return this._addRoute('PUT', path, schema, handler as RouteHandler<unknown, unknown>) as unknown as
      WeldServer<AddRoute<TRouter, TPath, 'PUT', TResponse, TBody>>
  }

  patch<TPath extends string, TBody = unknown, TResponse = unknown>(
    path: TPath,
    schema: ZodSchema<TResponse>,
    handler: RouteHandler<TBody, TResponse>,
  ): WeldServer<AddRoute<TRouter, TPath, 'PATCH', TResponse, TBody>> {
    return this._addRoute('PATCH', path, schema, handler as RouteHandler<unknown, unknown>) as unknown as
      WeldServer<AddRoute<TRouter, TPath, 'PATCH', TResponse, TBody>>
  }

  delete<TPath extends string, TResponse = unknown>(
    path: TPath,
    schema: ZodSchema<TResponse>,
    handler: RouteHandler<never, TResponse>,
  ): WeldServer<AddRoute<TRouter, TPath, 'DELETE', TResponse>> {
    return this._addRoute('DELETE', path, schema, handler as RouteHandler<unknown, unknown>) as unknown as
      WeldServer<AddRoute<TRouter, TPath, 'DELETE', TResponse>>
  }

  private _addRoute(
    method: HttpMethod,
    path: string,
    schema: ZodSchema | undefined,
    handler: RouteHandler<unknown, unknown>,
  ): this {
    const route: RouteDefinition = { method, path, handler }
    if (schema !== undefined) route.schema = schema
    this._routes.push(route)
    return this
  }

  /**
   * Fetch-compatible handler for Node/Bun/Deno/Edge.
   *   Bun: Bun.serve({ fetch: server.fetch })
   *   Node: createServer(server.nodeHandler).listen(3000)
   */
  get fetch(): (req: Request) => Promise<Response> {
    return createRequestHandler(this._routes, this.config)
  }

  /**
   * Start a built-in HTTP server (Node or Bun).
   */
  async listen(port?: number): Promise<void> {
    const p = port ?? this.config.port ?? 3000

    // Bun
    if (typeof (globalThis as Record<string, unknown>)['Bun'] !== 'undefined') {
      const BunGlobal = (globalThis as Record<string, unknown>)['Bun'] as {
        serve: (opts: { port: number; fetch: (req: Request) => Promise<Response> }) => void
      }
      BunGlobal.serve({ port: p, fetch: this.fetch })
      console.log(`[WELD Server] Listening on http://localhost:${p}`)
      return
    }

    // Node
    const { createServer } = await import('node:http')
    const handler = this.fetch
    const server  = createServer(async (nodeReq, nodeRes) => {
      const url  = `http://${nodeReq.headers.host ?? 'localhost'}${nodeReq.url ?? '/'}`
      const body = await new Promise<string>((resolve) => {
        let data = ''
        nodeReq.on('data', (chunk: Buffer) => { data += chunk.toString() })
        nodeReq.on('end', () => resolve(data))
      })

      const headers     = new Headers(nodeReq.headers as Record<string, string>)
      const isBodyless  = ['GET', 'HEAD'].includes(nodeReq.method ?? 'GET')
      const reqInit: RequestInit = { method: nodeReq.method ?? 'GET', headers }
      if (!isBodyless && body) reqInit.body = body
      const req = new Request(url, reqInit)

      const res = await handler(req)
      nodeRes.writeHead(res.status, Object.fromEntries(Array.from(res.headers as unknown as Iterable<[string, string]>)))
      nodeRes.end(await res.text())
    })

    server.listen(p, () => {
      console.log(`[WELD Server] Listening on http://localhost:${p}`)
    })
  }

  /**
   * Returns route definitions for introspection / code generation.
   */
  getRoutes(): RouteDefinition[] {
    return [...this._routes]
  }
}
