/**
 * WELD — Router Types
 * Defines the AppRouter contract for E2E type safety.
 * Cost in final bundle: 0KB (erased at compile time).
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type RouteDefinition = {
  [M in HttpMethod]?: {
    params?:  Record<string, string>
    query?:   Record<string, string | number | boolean>
    headers?: Record<string, string>
    body?:    unknown
    response: unknown
  }
}

/**
 * The full backend route map.
 * Define this type once (or infer it from your backend) and pass it to Weld<AppRouter>.
 *
 * @example
 * type MyRouter = {
 *   'v1/users': {
 *     GET: { response: User[] }
 *     POST: { body: CreateUserDto; response: User }
 *   }
 * }
 */
export type AppRouter = Record<string, RouteDefinition>

// ─── Type extraction helpers (0KB cost) ──────────────────────────────────────

export type InferResponse<
  TRouter extends AppRouter,
  TPath extends keyof TRouter,
  TMethod extends keyof TRouter[TPath],
> = TRouter[TPath][TMethod] extends { response: infer R } ? R : never

export type InferBody<
  TRouter extends AppRouter,
  TPath extends keyof TRouter,
  TMethod extends keyof TRouter[TPath],
> = TRouter[TPath][TMethod] extends { body: infer B } ? B : never

export type InferQuery<
  TRouter extends AppRouter,
  TPath extends keyof TRouter,
  TMethod extends keyof TRouter[TPath],
> = TRouter[TPath][TMethod] extends { query: infer Q } ? Q : never

export type InferParams<
  TRouter extends AppRouter,
  TPath extends keyof TRouter,
  TMethod extends keyof TRouter[TPath],
> = TRouter[TPath][TMethod] extends { params: infer P } ? P : never

/** All GET routes of a given router */
export type GetRoutes<TRouter extends AppRouter> = {
  [K in keyof TRouter]: TRouter[K] extends { GET: unknown } ? K : never
}[keyof TRouter]

/** All mutation routes (POST | PUT | PATCH | DELETE) of a given router */
export type MutationRoutes<TRouter extends AppRouter> = {
  [K in keyof TRouter]: TRouter[K] extends
    | { POST: unknown }
    | { PUT: unknown }
    | { PATCH: unknown }
    | { DELETE: unknown }
    ? K
    : never
}[keyof TRouter]
