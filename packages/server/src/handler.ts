import type { RouteDefinition, WeldRequest, WeldServerConfig } from './types.js'

function matchRoute(
  pattern: string,
  pathname: string,
): { matched: boolean; params: Record<string, string> } {
  const pp = pattern.split('/').filter(Boolean)
  const lp = pathname.split('/').filter(Boolean)
  if (pp.length !== lp.length) return { matched: false, params: {} }
  const params: Record<string, string> = {}
  for (let i = 0; i < pp.length; i++) {
    const p = pp[i]!
    const l = lp[i]!
    if (p.startsWith(':')) params[p.slice(1)] = decodeURIComponent(l)
    else if (p !== l) return { matched: false, params: {} }
  }
  return { matched: true, params }
}

function corsHeaders(config: WeldServerConfig): Record<string, string> {
  if (!config.cors) return {}
  const origins = typeof config.cors === 'object'
    ? config.cors.origins.join(',')
    : '*'
  return {
    'Access-Control-Allow-Origin':  origins,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  }
}

export function createRequestHandler(
  routes:  RouteDefinition[],
  config:  WeldServerConfig,
): (req: Request) => Promise<Response> {
  const cors = corsHeaders(config)
  const prefix = config.prefix ?? ''

  return async (req: Request): Promise<Response> => {
    const url      = new URL(req.url)
    const pathname = url.pathname.replace(prefix, '') || '/'
    const method   = req.method.toUpperCase()

    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }

    // Match route
    for (const route of routes) {
      if (route.method !== method) continue
      const { matched, params } = matchRoute(route.path, pathname)
      if (!matched) continue

      // Parse body
      let body: unknown = undefined
      if (!['GET', 'HEAD'].includes(method)) {
        const text = await req.text()
        if (text) {
          try { body = JSON.parse(text) } catch { body = text }
        }
      }

      // Build query params
      const query: Record<string, string> = {}
      url.searchParams.forEach((v, k) => { query[k] = v })

      // Build headers
      const headers: Record<string, string> = {}
      req.headers.forEach((v, k) => { headers[k] = v })

      const weldReq: WeldRequest = { body, params, query, headers, url: req.url, method: method as WeldRequest['method'] }

      let statusCode   = 200
      let responseSent = false
      let responseData: unknown

      const res = {
        status: (code: number) => { statusCode = code; return res },
        json:   (data: unknown) => { responseData = data; responseSent = true },
        error:  (message: string, status = 500) => {
          statusCode   = status
          responseData = { error: message }
          responseSent = true
        },
      }

      try {
        const result = await route.handler(weldReq, res)

        // If handler returned a value directly (didn't call res.json)
        if (!responseSent) responseData = result

        // Validate response with schema if provided
        if (route.schema) {
          const parsed = route.schema.safeParse(responseData)
          if (!parsed.success) {
            return new Response(JSON.stringify({ error: 'Response validation failed', issues: parsed.error.issues }), {
              status: 500,
              headers: { 'Content-Type': 'application/json', ...cors },
            })
          }
          responseData = parsed.data
        }

        return new Response(JSON.stringify(responseData), {
          status: statusCode,
          headers: { 'Content-Type': 'application/json', ...cors },
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Internal server error'
        return new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...cors },
        })
      }
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...cors },
    })
  }
}
