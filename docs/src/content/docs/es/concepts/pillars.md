---
title: Los 4 Pilares
description: Las cuatro innovaciones que hacen diferente a WELD
---

Cada petición en WELD pasa por un pipeline secuencial de 4 capas. Cada capa resuelve un problema específico que históricamente ha causado dolor en el desarrollo frontend.

```
api.get('v1/products', Schema, options)
         │
         ▼
┌─────────────────────────────────────────┐
│  CAPA 1 — DEDUPLICACIÓN                │
│  ¿Hay una petición idéntica en vuelo?   │
│  SÍ → devolver la misma Promise         │
│  NO  → continuar                        │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  CAPA 2 — REACTIVIDAD                  │
│  Inicializar señales                    │
│  Establecer status = 'loading'          │
│  Notificar a todos los suscriptores     │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  CAPA 3 — RED                          │
│  Online  → fetch() con AbortController  │
│  Offline (GET) → leer caché IndexedDB   │
│  Offline (mutación) → encolar localmente│
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  CAPA 4 — VALIDACIÓN                   │
│  Schema provisto → Zod safeParse        │
│  Sin schema → devolver datos crudos     │
│  Error de validación → señal de error   │
└─────────────────────────────────────────┘
```

Cada capa es independiente y testeable. Podés usar WELD sin Zod (saltea capa 4), sin soporte offline (saltea la rama offline de la capa 3), y sin señales (usá directamente la `promise`).
