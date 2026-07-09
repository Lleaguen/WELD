---
title: Introducción
description: Qué es WELD y por qué existe
---

WELD es un cliente HTTP nativo de TypeScript construido sobre una idea central: **el contrato entre tu backend y tu frontend debe aplicarse automáticamente**, no mantenerse a mano.

## El problema

Cada aplicación frontend enfrenta el mismo ciclo:

1. El backend cambia la forma de una respuesta
2. El frontend sigue leyendo la forma antigua
3. La UI renderiza datos incorrectos o falla en runtime
4. El developer pasa horas debuggeando

Las aserciones de tipo como `as User` no ayudan — mienten en runtime. Y agregar validación manual en todos lados es tedioso y propenso a errores.

## La solución

WELD resuelve esto con cuatro pilares que trabajan juntos en un único pipeline:

| Pilar | Qué hace |
|-------|----------|
| **Seguridad de Tipos E2E** | El tipo del router de tu backend fluye a cada petición. Rutas incorrectas, cuerpos incorrectos y query params incorrectos fallan en **tiempo de compilación**. |
| **Validación en Runtime** | Los esquemas de Zod validan la respuesta real en la frontera de la red. Sin más corrupción silenciosa de datos. |
| **Offline-First** | Las peticiones GET recurren al caché de IndexedDB cuando no hay red. Las mutaciones se encolan localmente y se reenvían automáticamente cuando la red se restaura. |
| **Deduplicación de Peticiones** | Las peticiones concurrentes al mismo recurso comparten una única Promise en vuelo. Sin hits duplicados al servidor. |

## Filosofía

WELD sigue la **Complejidad Progresiva** — es tan simple como una llamada directa a `fetch()` para una landing page, y escala hasta arquitectura hexagonal empresarial sin cambiar el modelo mental.

```ts
// Zero-config — simplemente funciona
const { promise } = api.get('v1/products')

// Potencia completa — seguro en tipos, validado, resiliente offline
const { signal, promise } = api.get('v1/products', z.array(ProductSchema), {
  offlineFallback: true,
  retry: { attempts: 3, delay: 300 },
})
```

Misma API. Mismo cliente. Diferentes niveles de seguridad según lo que tu proyecto necesite.
