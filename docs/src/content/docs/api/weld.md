---
title: new Weld()
description: API reference for the Weld client constructor
---

Creates a new WELD client instance bound to a base URL.

## Signature

```ts
new Weld<TRouter extends AppRouter>(
  baseUrl: string,
  config?: WeldClientConfig
)
```

## Parameters

### `baseUrl`

Type: `string`

The base URL prepended to every request path.

```ts
const api = new Weld('https://api.example.com')
// api.get('v1/products') → GET https://api.example.com/v1/products
```

### `config`

Type: `WeldClientConfig` — optional

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `headers` | `Record<string, string>` | `{}` | Default headers sent with every request |
| `timeout` | `number` | `10000` | Request timeout in milliseconds |
| `retry` | `RetryOptions` | `{ attempts: 3, delay: 300 }` | Global retry configuration |
| `offline` | `boolean` | `true` | Enable offline cache/queue globally |

## Examples

### Minimal setup

```ts
import { Weld } from 'weld-http'

const api = new Weld('https://api.example.com')
```

### With authentication

```ts
const api = new Weld('https://api.example.com', {
  headers: {
    Authorization: `Bearer ${token}`,
    'X-App-Version': '1.0.0',
  },
})
```

### With full configuration

```ts
const api = new Weld<AppRouter>('https://api.example.com', {
  headers: { Authorization: 'Bearer token' },
  timeout: 15_000,
  retry: {
    attempts:  3,
    delay:     500,
    condition: (err) => err.message !== '401', // don't retry auth errors
  },
  offline: true,
})
```

### TypeScript generic

Pass your `AppRouter` type as a generic to enable E2E type safety:

```ts
type AppRouter = {
  'v1/products': {
    GET: { response: Product[] }
  }
}

const api = new Weld<AppRouter>('https://api.example.com')
//    ^ now knows every route, method, body, and response type
```
