import type { ZodSchema } from 'zod'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface WeldRequest<TBody = unknown, TParams = Record<string, string>, TQuery = Record<string, string>> {
  body:    TBody
  params:  TParams
  query:   TQuery
  headers: Record<string, string>
  url:     string
  method:  HttpMethod
}

export interface WeldServerResponse {
  status:  (code: number) => WeldServerResponse
  json:    (data: unknown) => void
  error:   (message: string, status?: number) => void
}

export type RouteHandler<TBody = unknown, TResponse = unknown> = (
  req: WeldRequest<TBody>,
  res: WeldServerResponse,
) => TResponse | Promise<TResponse>

export interface RouteDefinition {
  method:  HttpMethod
  path:    string
  schema?: ZodSchema
  handler: RouteHandler<unknown, unknown>
}

export interface WeldServerConfig {
  port?:    number
  cors?:    boolean | { origins: string[] }
  prefix?:  string
}
