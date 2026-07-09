---
title: Hexagonal Architecture
description: Using WELD as an infrastructure adapter in Hexagonal / Clean Architecture
---

WELD is designed to live exclusively in the **infrastructure layer** of a Hexagonal (Ports & Adapters) architecture. Your domain and application layers never know WELD exists.

## Where WELD lives

```
┌─────────────────────────────────────────────┐
│              UI Layer                        │
│  (React components, Vue composables)         │
├─────────────────────────────────────────────┤
│           Application Layer                  │
│  (Use cases, commands, queries)              │
├─────────────────────────────────────────────┤
│             Domain Layer                     │
│  (Entities, value objects, domain events)    │
├─────────────────────────────────────────────┤
│          Infrastructure Layer  ◄─── WELD     │
│  (HTTP adapters, IndexedDB, external APIs)   │
└─────────────────────────────────────────────┘
```

WELD is a **driven adapter** (output port). It fetches data from the outside world and maps it into your domain entities.

## Example

### 1. Define the port (interface in domain layer)

```ts
// src/products/domain/ports/ProductRepository.ts
export interface ProductRepository {
  findAll(): Promise<Product[]>
  create(data: CreateProductDto): Promise<Product>
}
```

### 2. Implement with WELD (infrastructure layer)

```ts
// src/products/infrastructure/WeldProductRepository.ts
import { Weld } from 'weld-http'
import { z } from 'zod'
import type { ProductRepository } from '../domain/ports/ProductRepository'
import type { Product } from '../domain/entities/Product'

const ProductSchema = z.object({
  id:    z.string(),
  name:  z.string(),
  price: z.number(),
}).transform((dto): Product => ({
  // Map DTO → Domain Entity
  id:    dto.id,
  name:  dto.name,
  price: dto.price,
}))

export class WeldProductRepository implements ProductRepository {
  private api = new Weld<AppRouter>('https://api.example.com')

  async findAll(): Promise<Product[]> {
    return this.api.get('v1/products', z.array(ProductSchema)).promise
  }

  async create(data: CreateProductDto): Promise<Product> {
    return this.api.post('v1/products', ProductSchema, { body: data }).promise
  }
}
```

### 3. Use in application layer (no WELD knowledge)

```ts
// src/products/application/GetProductsUseCase.ts
export class GetProductsUseCase {
  constructor(private readonly repo: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.repo.findAll()
    // No idea that WELD, fetch, or IndexedDB exist
  }
}
```

### 4. Wire it up

```ts
// src/main.ts
const repository = new WeldProductRepository()
const useCase    = new GetProductsUseCase(repository)

const products = await useCase.execute()
```

## Why Zod schemas are perfect mappers

The Zod schema in the infrastructure layer does three jobs at once:

1. **Validates** — ensures the DTO from the API is structurally correct
2. **Transforms** — maps the DTO into a clean domain entity via `.transform()`
3. **Documents** — the schema is the living contract between infrastructure and domain

All the complexity of retries, offline queues, and IndexedDB stays inside the `WeldProductRepository`. Your use cases stay pure.
