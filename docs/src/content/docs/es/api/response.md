---
title: WeldResponse
description: El objeto retornado por cada método de petición
---

Cada método de petición retorna un objeto `WeldResponse<T>` con tres propiedades.

## Forma

```ts
interface WeldResponse<T> {
  signal:  WeldSignalState<T>
  promise: Promise<T>
  abort:   () => void
}
```

## `signal`

Contenedor de estado reactivo powered by `@preact/signals-core`.

```ts
interface WeldSignalState<T> {
  data:   Signal<T | null>
  status: Signal<'idle' | 'loading' | 'success' | 'error'>
  error:  Signal<Error | null>
}
```

### Suscribirse directamente

```ts
const { signal } = api.get('v1/products', Schema)

const unsubscribe = signal.data.subscribe((data) => {
  console.log('data cambió:', data)
})

// Desuscribirse cuando termine
unsubscribe()
```

## `promise`

Una Promise estándar que resuelve con los datos validados o rechaza con un error.

```ts
const { promise } = api.get('v1/products', Schema)
const products = await promise
```

## `abort`

Cancela la petición en vuelo. La promise rechazará con un AbortError.

```ts
const { promise, abort } = api.get('v1/products', Schema)
abort()
```

## Ciclo de vida del status

```
idle → loading → success
               → error
```

| Status | Significado |
|--------|-------------|
| `idle` | Estado inicial antes de cualquier petición |
| `loading` | Petición en vuelo |
| `success` | Petición completada y datos validados |
| `error` | Petición fallida o validación fallida |
