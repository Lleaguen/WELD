---
title: The 4 Pillars
description: The four innovations that make WELD different
---

Every request in WELD passes through a sequential 4-layer pipeline. Each layer solves one specific problem that has historically caused pain in frontend development.

```
api.get('v1/products', Schema, options)
         │
         ▼
┌─────────────────────────────────────────┐
│  LAYER 1 — DEDUPLICATION               │
│  Is there an identical request in       │
│  flight right now?                      │
│  YES → return the same Promise          │
│  NO  → continue                         │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  LAYER 2 — REACTIVITY                  │
│  Initialize signals                     │
│  Set status = 'loading'                 │
│  Notify all subscribers                 │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  LAYER 3 — NETWORK                     │
│  Online  → fetch() with AbortController │
│  Offline (GET) → read IndexedDB cache   │
│  Offline (mutation) → enqueue locally   │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  LAYER 4 — VALIDATION                  │
│  Schema provided → Zod safeParse        │
│  No schema → return raw data            │
│  Validation error → set error signal    │
└─────────────────────────────────────────┘
```

Each layer is independent and testable. You can use WELD without Zod (skips layer 4), without offline support (skips the offline branch of layer 3), and without signals (use the `promise` directly).
