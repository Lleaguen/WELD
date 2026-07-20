---
title: Arquitectura Hexagonal
description: Usando WELD como adaptador de infraestructura en Arquitectura Hexagonal / Clean Architecture
---

WELD está diseñado para vivir exclusivamente en la **capa de infraestructura** de una arquitectura Hexagonal (Puertos y Adaptadores). Tu dominio y capas de aplicación nunca saben que WELD existe.

## Dónde vive WELD

```
┌─────────────────────────────────────────────┐
│              Capa UI                         │
│  (Componentes React, composables Vue)        │
├─────────────────────────────────────────────┤
│           Capa de Aplicación                 │
│  (Casos de uso, comandos, queries)           │
├─────────────────────────────────────────────┤
│             Capa de Dominio                  │
│  (Entidades, objetos de valor, eventos)      │
├─────────────────────────────────────────────┤
│       Capa de Infraestructura  ◄─── WELD     │
│  (Adaptadores HTTP, IndexedDB, APIs externas)│
└─────────────────────────────────────────────┘
```

WELD es un **adaptador conducido** (puerto de salida). Obtiene datos del mundo exterior y los mapea a tus entidades de dominio.

## Ejemplo

### 1. Definí el puerto (interfaz en la capa de dominio)

```ts
// src/products/domain/ports/ProductRepository.ts
export interface ProductRepository {
  findAll(): Promise<Product[]>
  create(data: CreateProductDto): Promise<Product>
}
```

### 2. Implementá con WELD (capa de infraestructura)

```ts
// src/products/infrastructure/WeldProductRepository.ts
import { Weld } from '@weldjs/http'
import { z } from 'zod'
import type { ProductRepository } from '../domain/ports/ProductRepository'
import type { Product } from '../domain/entities/Product'

const ProductSchema = z.object({
  id:    z.string(),
  name:  z.string(),
  price: z.number(),
}).transform((dto): Product => ({
  id:    dto.id,
  name:  dto.name,
  price: dto.price,
}))

export class WeldProductRepository implements ProductRepository {
  private api = new Weld<AppRouter>('https://api.ejemplo.com')

  async findAll(): Promise<Product[]> {
    return this.api.get('v1/products', z.array(ProductSchema)).promise
  }

  async create(data: CreateProductDto): Promise<Product> {
    return this.api.post('v1/products', ProductSchema, { body: data }).promise
  }
}
```

### 3. Usalo en la capa de aplicación (sin conocimiento de WELD)

```ts
// src/products/application/GetProductsUseCase.ts
export class GetProductsUseCase {
  constructor(private readonly repo: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.repo.findAll()
    // No sabe que WELD, fetch o IndexedDB existen
  }
}
```

## Por qué los schemas Zod son mapeadores perfectos

El schema Zod en la capa de infraestructura hace tres trabajos al mismo tiempo:

1. **Valida** — asegura que el DTO de la API es estructuralmente correcto
2. **Transforma** — mapea el DTO a una entidad de dominio limpia a través de `.transform()`
3. **Documenta** — el schema es el contrato vivo entre infraestructura y dominio

Toda la complejidad de reintentos, colas offline e IndexedDB permanece dentro del `WeldProductRepository`. Tus casos de uso permanecen puros.
