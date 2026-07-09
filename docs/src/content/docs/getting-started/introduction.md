---
title: Introduction
description: What is WELD and why does it exist?
---

WELD is a TypeScript-native HTTP client built around a single idea: **the contract between your backend and frontend should be enforced automatically**, not maintained by hand.

## The Problem

Every frontend application faces the same cycle:

1. Backend changes a response shape
2. Frontend keeps reading the old shape
3. UI silently renders wrong data or crashes at runtime
4. Developer spends hours debugging

Type assertions like `as User` don't help — they lie at runtime. And adding manual validation everywhere is tedious and error-prone.

## The Solution

WELD solves this with four pillars working together in a single pipeline:

| Pillar | What it does |
|--------|-------------|
| **E2E Type Safety** | Your backend router type flows into every request. Wrong paths, wrong bodies, and wrong query params break at **compile time**. |
| **Runtime Validation** | Zod schemas validate the actual response at the network boundary. No more silent data corruption. |
| **Offline-First** | GET requests fall back to IndexedDB cache when offline. Mutations queue locally and replay when the network restores. |
| **Request Deduplication** | Concurrent requests for the same resource share one in-flight Promise. No duplicate server hits. |

## Philosophy

WELD follows **Progressive Complexity** — it's as simple as a direct `fetch()` call for a landing page, and scales up to enterprise hexagonal architecture without changing your mental model.

```ts
// Zero-config — just works
const { promise } = api.get('v1/products')

// Full power — type-safe, validated, offline-resilient
const { signal, promise } = api.get('v1/products', z.array(ProductSchema), {
  offlineFallback: true,
  retry: { attempts: 3, delay: 300 },
})
```

Same API. Same client. Different levels of safety depending on what your project needs.
