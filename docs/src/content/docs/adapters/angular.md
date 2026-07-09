---
title: Angular Adapter
description: Using weld-http with Angular via RxJS Observables
---

The Angular adapter converts WELD signals into RxJS `Observable` streams. Use them with the `async` pipe in templates or subscribe directly in services.

## Setup

rxjs 7+ is required as a peer dependency.

```bash
npm install weld-http zod rxjs
```

## toObservable()

```ts
import { toObservable } from 'weld-http/angular'

const { data$, status$, error$, loading$ } = toObservable(weldResponse)
```

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `data$` | `Observable<T \| null>` | The validated response data |
| `status$` | `Observable<WeldStatus>` | Current request status |
| `error$` | `Observable<Error \| null>` | Error if the request failed |
| `loading$` | `Observable<boolean>` | Shorthand for `status === 'loading'` |

Each Observable **emits immediately** with the current value and then on every subsequent change.

## Example — Component with async pipe

```ts
// products.component.ts
import { Component } from '@angular/core'
import { AsyncPipe, NgFor, NgIf } from '@angular/common'
import { Weld } from 'weld-http'
import { toObservable } from 'weld-http/angular'
import { z } from 'zod'

const api = new Weld('https://api.example.com')

const ProductSchema = z.object({
  id:    z.string(),
  name:  z.string(),
  price: z.number(),
})

@Component({
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf],
  template: `
    <p *ngIf="loading$ | async">Loading products...</p>
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

## Example — Service

```ts
// products.service.ts
import { Injectable } from '@angular/core'
import { toObservable } from 'weld-http/angular'

@Injectable({ providedIn: 'root' })
export class ProductsService {
  getProducts() {
    const response = api.get('v1/products', z.array(ProductSchema))
    return toObservable(response)
  }
}
```
