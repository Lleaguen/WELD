---
title: Deduplicación de Peticiones
description: Cómo WELD previene peticiones duplicadas en vuelo
---

Cuando múltiples componentes solicitan el mismo recurso al mismo tiempo, WELD detecta el duplicado y vincula a todos los llamadores a **una única Promise en vuelo** en vez de enviar N peticiones al servidor.

## El problema que resuelve

Imaginá un dashboard con 3 componentes que todos necesitan los datos del usuario actual al montarse:

```ts
// Componente A
const user = await api.get('v1/me').promise

// Componente B (se monta al mismo tiempo)
const user = await api.get('v1/me').promise

// Componente C (se monta al mismo tiempo)
const user = await api.get('v1/me').promise
```

Sin deduplicación: **3 peticiones de red** llegan a tu servidor simultáneamente.  
Con WELD: **1 petición de red**, los tres componentes obtienen el mismo resultado.

## Cómo funciona

WELD genera una clave de caché determinista a partir del método, URL, query params y cuerpo de la petición. Si ya hay una petición con esa clave en vuelo, el nuevo llamador recibe la Promise existente en vez de iniciar una nueva.

```
Petición A → key: "GET::/v1/me::::" → sin coincidencia → inicia fetch, registra Promise
Petición B → key: "GET::/v1/me::::" → coincidencia encontrada → devuelve Promise existente
Petición C → key: "GET::/v1/me::::" → coincidencia encontrada → devuelve Promise existente

El servidor recibe: 1 petición
Los 3 llamadores reciben: los mismos datos
```

Una vez que la Promise se resuelve (éxito o error), se elimina del mapa automáticamente.

## La deduplicación está activa por defecto

No necesitás configurar nada. Está activa para todas las peticiones GET automáticamente.

```ts
// Estas tres llamadas — incluso desde componentes distintos — comparten una sola petición
api.get('v1/products', Schema)
api.get('v1/products', Schema)
api.get('v1/products', Schema)
```

## Deshabilitarla

```ts
const { promise } = api.get('v1/products', Schema, {
  deduplicate: false, // siempre dispara una nueva petición
})
```

:::note
La deduplicación solo aplica a peticiones GET. Las mutaciones (POST, PUT, PATCH, DELETE) siempre se ejecutan de forma independiente.
:::
