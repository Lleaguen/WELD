# WELD — Arquitectura Técnica Completa

## Stack de Herramientas

| Herramienta | Rol |
|---|---|
| TypeScript 5.x | Lenguaje base, tipos mapeados avanzados |
| tsup + esbuild | Build system, genera ESM + CJS + .d.ts |
| Vitest | Testing unitario e integración |
| @preact/signals-core | Primitiva de reactividad agnóstica |
| Zod | Validación en runtime |
| pnpm workspaces | Monorepo |

---

## Estructura del Monorepo

```
weld/
├── packages/
│   ├── core/                        # @weld/core — Motor principal
│   ├── adapter-react/               # @weld/react — Hook useWeld()
│   ├── adapter-vue/                 # @weld/vue — Composable useWeld()
│   ├── adapter-solid/               # @weld/solid — Integración signals nativos
│   └── adapter-angular/             # @weld/angular — Service + Observable bridge
├── examples/
│   ├── react-vite/
│   ├── vue-nuxt/
│   └── next-ssr/
├── docs/
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.base.json
```

---

## Paquete Core: `@weld/core`

### Estructura interna

```
packages/core/
├── src/
│   ├── index.ts                     # Entry point público
│   │
│   ├── types/
│   │   ├── router.ts                # Tipos del AppRouter (E2E type safety)
│   │   ├── request.ts               # WeldRequestOptions, WeldMethod
│   │   └── response.ts              # WeldResponse<T>, WeldSignalState<T>
│   │
│   ├── client/
│   │   └── Weld.ts                  # Clase principal — instancia del cliente
│   │
│   ├── pipeline/
│   │   ├── index.ts                 # Orquestador del pipeline secuencial
│   │   ├── deduplication.ts         # Capa 1: Deduplicación de peticiones
│   │   ├── reactivity.ts            # Capa 2: Inicialización de signals
│   │   ├── network.ts               # Capa 3: Online/Offline detection
│   │   └── validation.ts            # Capa 4: SafeParse con Zod
│   │
│   ├── offline/
│   │   ├── storage.ts               # Abstracción sobre IndexedDB
│   │   ├── cache.ts                 # Lectura/escritura de cache GET
│   │   └── queue.ts                 # Cola de mutaciones offline
│   │
│   ├── signals/
│   │   └── state.ts                 # WeldSignal<T>: wrapper sobre @preact/signals-core
│   │
│   └── utils/
│       ├── hash.ts                  # Generador de cache keys
│       └── retry.ts                 # Lógica de reintentos con backoff exponencial
│
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

---

## Tipos Centrales

### `types/router.ts` — E2E Type Safety

```typescript
// El developer define (o infiere del backend) este contrato
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type RouteDefinition = {
  [M in HttpMethod]?: {
    params?:   Record<string, string>
    query?:    Record<string, string | number | boolean>
    headers?:  Record<string, string>
    body?:     unknown
    response:  unknown
  }
}

// El AppRouter es el mapa completo de rutas del backend
export type AppRouter = Record<string, RouteDefinition>

// Helpers de extracción de tipos — costo en bundle: 0KB
export type InferResponse<
  TRouter extends AppRouter,
  TPath extends keyof TRouter,
  TMethod extends keyof TRouter[TPath]
> = TRouter[TPath][TMethod] extends { response: infer R } ? R : never

export type InferBody<
  TRouter extends AppRouter,
  TPath extends keyof TRouter,
  TMethod extends keyof TRouter[TPath]
> = TRouter[TPath][TMethod] extends { body: infer B } ? B : never

export type InferQuery<
  TRouter extends AppRouter,
  TPath extends keyof TRouter,
  TMethod extends keyof TRouter[TPath]
> = TRouter[TPath][TMethod] extends { query: infer Q } ? Q : never
```

### `types/response.ts` — Estado Reactivo

```typescript
import type { Signal } from '@preact/signals-core'
import type { ZodSchema } from 'zod'

export type WeldStatus = 'idle' | 'loading' | 'success' | 'error'

// Estado interno que viven en signals
export interface WeldSignalState<T> {
  data:    Signal<T | null>
  status:  Signal<WeldStatus>
  error:   Signal<Error | null>
}

// Lo que el developer recibe al llamar api.get() / api.post()
export interface WeldResponse<T> {
  // Signals agnósticos (para vanilla JS o adapters custom)
  signal:  WeldSignalState<T>
  // Promesa directa (para await simple)
  promise: Promise<T>
  // Cancelación
  abort:   () => void
}
```

### `types/request.ts` — Opciones de Petición

```typescript
import type { ZodSchema } from 'zod'

export interface WeldRequestOptions<TBody = unknown> {
  headers?:         Record<string, string>
  query?:           Record<string, string | number | boolean>
  body?:            TBody
  schema?:          ZodSchema           // Validación Zod opcional
  offlineFallback?: boolean             // Activar cache offline (default: true para GET)
  deduplicate?:     boolean             // Deduplicar peticiones (default: true)
  retry?:           RetryOptions
  timeout?:         number              // ms
}

export interface RetryOptions {
  attempts:  number                     // default: 3
  delay:     number                     // ms base para backoff exponencial
  condition?: (error: Error) => boolean // filtro de reintentos
}
```

---

## Pipeline de Ejecución (Detalle)

```
api.get('v1/products', ProductSchema, options)
         │
         ▼
┌─────────────────────────────────────────────┐
│  CAPA 1 — DEDUPLICACIÓN                     │
│  Genera hash(método + url + query + body)   │
│  ¿Existe Promise activa con ese hash?       │
│  SÍ → retorna la misma Promise en vuelo     │
│  NO → continúa al siguiente paso            │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│  CAPA 2 — REACTIVIDAD                       │
│  Crea o recupera WeldSignalState<T>         │
│  Setea status = 'loading'                   │
│  Notifica a todos los suscriptores          │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│  CAPA 3 — GESTIÓN DE RED                    │
│  ¿navigator.onLine === true?                │
│  SÍ → ejecuta fetch() con AbortController  │
│  NO (GET) → busca en IndexedDB cache       │
│  NO (POST/PUT/DELETE) → encola en queue    │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│  CAPA 4 — VALIDACIÓN CONTRACTUAL            │
│  ¿Se proporcionó ZodSchema?                 │
│  SÍ → schema.safeParse(responseData)        │
│    OK → setea data, status = 'success'      │
│    FAIL → setea error, status = 'error'     │
│  NO → retorna data cruda (zero-config mode) │
└─────────────────────────────────────────────┘
```

---

## Módulo Offline

### Cache (GET)

```
IndexedDB
└── weld_cache (store)
    ├── key: hash(url + query)
    └── value: { data: T, timestamp: number, ttl: number }
```

### Queue (Mutaciones)

```
IndexedDB
└── weld_queue (store)
    ├── key: autoincrement (preserva orden FIFO)
    └── value: {
          id:        string
          method:    'POST' | 'PUT' | 'PATCH' | 'DELETE'
          url:       string
          body:      unknown
          headers:   Record<string, string>
          createdAt: number
          attempts:  number
        }
```

**Flujo de sincronización:**
1. `window.addEventListener('online', syncQueue)`
2. `syncQueue` lee todos los items de `weld_queue` en orden FIFO
3. Ejecuta cada petición con reintentos
4. Si tiene éxito → elimina el item del store
5. Si falla definitivamente → marca como `dead_letter` (no bloquea el resto)

---

## Adapters de Framework

### `@weld/react`

```typescript
// Internamente usa useSyncExternalStore (React 18+)
function useWeld<T>(weldResponse: WeldResponse<T>): {
  data:    T | null
  status:  WeldStatus
  error:   Error | null
}
```

### `@weld/vue`

```typescript
// Internamente usa watchEffect + ref
function useWeld<T>(weldResponse: WeldResponse<T>): {
  data:    Ref<T | null>
  status:  Ref<WeldStatus>
  error:   Ref<Error | null>
}
```

### `@weld/solid`

```typescript
// Solid ya usa signals nativos, bridge directo
function useWeld<T>(weldResponse: WeldResponse<T>): {
  data:    Accessor<T | null>
  status:  Accessor<WeldStatus>
  error:   Accessor<Error | null>
}
```

### `@weld/angular`

```typescript
// Convierte signals a Observables RxJS
function toObservable<T>(weldResponse: WeldResponse<T>): {
  data$:   Observable<T | null>
  status$: Observable<WeldStatus>
  error$:  Observable<Error | null>
}
```

---

## API Pública Final

```typescript
const api = new Weld<AppBackendRouter>('https://api.empresa.com', {
  headers: { Authorization: 'Bearer token' },
  retry:   { attempts: 3, delay: 300 },
  timeout: 10_000,
})

// GET — con validación, offline cache automático
const { signal, promise } = api.get('v1/products', z.array(ProductSchema))

// GET — zero config (sin schema, retorna dato crudo)
const { promise } = api.get('v1/products')

// POST — body tipado por el contrato del router
const { signal, promise } = api.post('v1/products', {
  body:   { name: 'Producto', price: 99 },
  schema: ProductSchema,
})

// Cancelación
const { abort } = api.get('v1/products')
abort()
```

---

## Build Output por Paquete

```
packages/core/dist/
├── index.js          # CJS
├── index.mjs         # ESM
└── index.d.ts        # Tipos

packages/adapter-react/dist/
├── index.js
├── index.mjs
└── index.d.ts
```

---

## Roadmap de Implementación

| Fase | Alcance |
|---|---|
| **v0.1 — Core** | Pipeline completo, signals, types, zero-config mode |
| **v0.2 — Validation** | Integración Zod, safeParse, error handling |
| **v0.3 — Offline** | IndexedDB cache para GET, queue para mutaciones |
| **v0.4 — Adapters** | @weld/react, @weld/vue |
| **v0.5 — Enterprise** | Deduplicación, retry con backoff, timeout |
| **v1.0 — Stable** | @weld/solid, @weld/angular, docs, ejemplos |
