---
title: Navegación
description: Links, navegación programática y hooks.
---

## Componente Link

```tsx
import { Link } from '@weldjs/router'

<Link to="/users">Usuarios</Link>

// Con estilos activos
<Link
  to="/users"
  activeStyle={{ color: 'var(--weld-plasma-cyan)' }}
>
  Usuarios
</Link>
```

## useNavigate

```tsx
import { useNavigate } from '@weldjs/router'

function CreateUser() {
  const navigate = useNavigate()

  const handleSubmit = async () => {
    await api.post('users', Schema, { body: form.values }).promise
    navigate('/users')
  }
}
```

## useLocation

```tsx
import { useLocation } from '@weldjs/router'

const { pathname, search, hash } = useLocation()
```

## useSearchParams

```tsx
import { useSearchParams } from '@weldjs/router'

const params = useSearchParams()
const page   = params.get('page') ?? '1'
```

## Redirect

Redirección declarativa:

```tsx
import { Redirect } from '@weldjs/router'

function RutaVieja() {
  return <Redirect to="/nueva-ruta" />
}
```
