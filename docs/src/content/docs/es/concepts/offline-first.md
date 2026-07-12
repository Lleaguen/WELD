---
title: Offline-First
description: Cómo WELD maneja cortes de red automáticamente
---

WELD está construido para el mundo real, donde las redes son poco confiables. Maneja los escenarios offline de manera diferente según el tipo de petición.

## Peticiones GET — Caché de respaldo

Cuando hacés una petición GET, WELD automáticamente guarda en caché la respuesta exitosa en **IndexedDB**. Si la red se cae y se hace la misma petición de nuevo, WELD sirve los datos del caché de forma transparente.

```ts
const { promise } = api.get('v1/products', ProductArraySchema, {
  offlineFallback: true, // por defecto para peticiones GET
})

// Online: obtiene del servidor, guarda la respuesta en caché
// Offline: devuelve los datos del caché de IndexedDB
const products = await promise
```

El caché tiene un TTL por defecto de 5 minutos.

## Cola de mutaciones — POST, PUT, PATCH, DELETE

Cuando una mutación falla porque el dispositivo está offline, WELD no lanza un error y se rinde. En cambio, **encola la mutación en IndexedDB** y la reproduce automáticamente cuando se restaura la red.

```ts
// El usuario está offline — esto no falla
const { promise } = api.post('v1/orders', Schema, {
  body: { productId: '123', quantity: 2 },
})

// La mutación se guarda en la cola
// Cuando vuelve la red, se ejecuta automáticamente
```

## Cómo funciona la sincronización de la cola

WELD escucha el evento `navigator.onLine` del browser. Cuando se dispara, el procesador de cola:

1. Lee todas las mutaciones pendientes de IndexedDB en orden **FIFO** (primero en entrar, primero en salir)
2. Reproduce cada mutación contra el servidor
3. Éxito → la elimina de la cola
4. Fallo → incrementa el contador de intentos
5. Después de 5 intentos fallidos → la marca como dead letter (se mantiene para inspección, no bloquea a las demás)

## Sincronización manual

Podés disparar una sincronización manual si es necesario:

```ts
import { syncQueue } from 'weld-http'

// Forzar la reproducción de todas las mutaciones encoladas ahora
await syncQueue()
```

## Deshabilitar el soporte offline

```ts
// Deshabilitar para una petición específica
const { promise } = api.get('v1/products', Schema, {
  offlineFallback: false,
})

// Deshabilitar globalmente
const api = new Weld<AppRouter>('https://api.example.com', {
  offline: false,
})
```

## Soporte de browsers

Offline-First requiere `IndexedDB` y `navigator.onLine`, disponibles en todos los browsers modernos. En Node.js, Bun y Deno, el modo offline se deshabilita automáticamente ya que estos entornos no tienen `IndexedDB`.
