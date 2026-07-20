---
title: Adaptador Angular
description: Using @weldjs/http with Angular a través de Observables RxJS
---

El adaptador Angular convierte las señales WELD en streams `Observable` de RxJS. Usalos con el pipe `async` en templates o suscribite directamente en servicios.

## Setup

Se requiere rxjs 7+ como peer dependency.

```bash
npm install @weldjs/http zod rxjs
```

## toObservable()

```ts
import { toObservable } from '@weldjs/http/angular'

const { data$, status$, error$, loading$ } = toObservable(weldResponse)
```

### Retorna

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `data$` | `Observable<T \| null>` | Los datos de respuesta validados |
| `status$` | `Observable<WeldStatus>` | Estado actual de la petición |
| `error$` | `Observable<Error \| null>` | Error si la petición falló |
| `loading$` | `Observable<boolean>` | Atajo para `status === 'loading'` |

Cada Observable **emite inmediatamente** con el valor actual y luego en cada cambio posterior.

## Ejemplo — Componente con pipe async

```ts
// products.component.ts
import { Component } from '@angular/core'
import { AsyncPipe, NgFor, NgIf } from '@angular/common'
import { Weld } from '@weldjs/http'
import { toObservable } from '@weldjs/http/angular'
import { z } from 'zod'

const api = new Weld('https://api.ejemplo.com')

const ProductSchema = z.object({
  id:    z.string(),
  name:  z.string(),
  price: z.number(),
})

@Component({
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf],
  template: `
    <p *ngIf="loading$ | async">Cargando productos...</p>
    <ul>
      <li *ngFor="let product of data$ | async">
        <strong>{{ product.name }}</strong> — {{ product.price | currency }}
      </li>
    </ul>
  `,
})
export class ProductsComponent {
  private response = api.get('v1/products', z.array(ProductSchema))

  data$    = toObservable(this.response).data$
  loading$ = toObservable(this.response).loading$
}
```
