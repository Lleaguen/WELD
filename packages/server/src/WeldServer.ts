import type { ZodSchema } from 'zod'
import type {
  HttpMethod,
  RouteDefinition,
  RouteHandler,
  WeldRequest,
  WeldServerConfig,
} from './types.js'
import { createRequestHandler } from './handler.js'

export class WeldServer {
  private routes: RouteDefinition[] = []
  private config: WeldServerConfig

  // router type is inferred from registered routes
  readonly router: Record<string, Record<string, { response: unknown }>> = {}

  constructor(config: WeldServerConfig = {}) {
    this.config = { port: 3000, cors: true, ...config }
  }

  get<TResponse = unknown>(
    path: string,
    schema: ZodSchema<TResponse>,
    handler: RouteHandler<never, TResponse>,
  ): this {
    return this.addRoute('GET', path, schema, handler as RouteHandler<unknown, unknown>)
  }

  post<TBody = unknown, TResponse = unknown>(
    path: string,
    schema: ZodSchema<TResponse>,
    handler: RouteHandler<TBody, TResponse>,
  ): this {
    return this.addRoute('POST', path, schema, handler as RouteHandler<unknown, unknown>)
  }

  put<TBody = unknown, TResponse = unknown>(
    path: string,
    schema: ZodSchema<TResponse>,
    handler: RouteHandler<TBody, TResponse>,
  ): this {
    return this.addRoute('PUT', path, schema, handler as RouteHandler<unknown, unknown>)
  }

  patch<TBody = unknown, TResponse = unknown>(
    path: string,
    schema: ZodSchema<TResponse>,
    handler: RouteHandler<TBody, TResponse>,
  ): this {
    return this.addRoute('PATCH', path, schema, handler as RouteHandler<unknown, unknown>)
  }

  delete<TResponse = unknown>(
    path: string,
    schema: ZodSchema<TResponse>,
    handler: RouteHandler<never, TResponse>,
  ): this {
    return this.addRoute('DELETE', path, schema, handler as RouteHandler<unknown, unknown>)
  }

  private addRoute(
    method: HttpMethod,
    path: string,
    schema: ZodSchema | undefined,
    handler: RouteHandler<unknown, unknown>,
  ): this {
    const route: RouteDefinition = { method, path, handler }
    if (schema !== undefined) route.schema = schema
    this.routes.push(route)
    return this
  }

  /**
   * Returns a fetch-compatible handler for use with Node/Bun/Deno/Edge.
   * Usage with Bun: Bun.serve({ fetch: server.fetch })
   * Usage with Node: createServer(server.nodeHandler).listen(3000)
   */
  get fetch(): (req: Request) => Promise<Response> {
    return createRequestHandler(this.routes, this.config)
  }

  /**
   * Start a built-in HTTP server (Node or Bun).
   */
  async listen(port?: number): Promise<void> {
    const p = port ?? this.config.port ?? 3000

    // Bun
    if (typeof (globalThis as Record<string, unknown>)['Bun'] !== 'undefined') {
      const BunGlobal = (globalThis as Record<string, unknown>)['Bun'] as { serve: (opts: { port: number; fetch: (req: Request) => Promise<Response> }) => void }
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

      const headers = new Headers(nodeReq.headers as Record<string, string>)
      const isBodyless = ['GET', 'HEAD'].includes(nodeReq.method ?? 'GET')
      const reqInit: RequestInit = { method: nodeReq.method ?? 'GET', headers }
      if (!isBodyless && body) reqInit.body = body
      const req = new Request(url, reqInit)

      const res = await handler(req)
      nodeRes.writeHead(res.status, Object.fromEntries(res.headers.entries()))
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
    return [...this.routes]
  }
}
