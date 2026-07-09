---
title: WeldResponse
description: The object returned by every request method
---

Every request method returns a `WeldResponse<T>` object with three properties.

## Shape

```ts
interface WeldResponse<T> {
  signal:  WeldSignalState<T>
  promise: Promise<T>
  abort:   () => void
}
```

## `signal`

A reactive state container powered by `@preact/signals-core`. Use this with framework adapters or subscribe directly in vanilla JS.

```ts
interface WeldSignalState<T> {
  data:   Signal<T | null>
  status: Signal<'idle' | 'loading' | 'success' | 'error'>
  error:  Signal<Error | null>
}
```

### Subscribing directly

```ts
const { signal } = api.get('v1/products', Schema)

// Subscribe to any signal field
const unsubscribe = signal.data.subscribe((data) => {
  console.log('data changed:', data)
})

// Unsubscribe when done
unsubscribe()
```

### Reading current value

```ts
const { signal } = api.get('v1/products', Schema)
console.log(signal.status.value) // 'loading'

// After promise resolves:
console.log(signal.status.value) // 'success'
console.log(signal.data.value)   // Product[]
```

## `promise`

A standard Promise that resolves with the validated data or rejects with an error.

```ts
const { promise } = api.get('v1/products', Schema)

// async/await
const products = await promise

// .then/.catch
promise
  .then((products) => console.log(products))
  .catch((err) => console.error(err))
```

## `abort`

Cancels the in-flight request. The promise will reject with an AbortError.

```ts
const { promise, abort } = api.get('v1/products', Schema)

// Cancel immediately
abort()

try {
  await promise
} catch (err) {
  console.log(err.name) // 'AbortError'
}
```

## Status lifecycle

```
idle → loading → success
               → error
```

| Status | Meaning |
|--------|---------|
| `idle` | Initial state before any request |
| `loading` | Request is in-flight |
| `success` | Request completed and data is validated |
| `error` | Request failed or validation failed |
