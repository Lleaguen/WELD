---
title: Navigation
description: Links, programmatic navigation, and hooks.
---

## Link component

```tsx
import { Link } from '@weldjs/router'

<Link to="/users">Users</Link>

// With active styles
<Link
  to="/users"
  activeStyle={{ color: 'var(--weld-plasma-cyan)' }}
>
  Users
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

Declarative redirect:

```tsx
import { Redirect } from '@weldjs/router'

function OldRoute() {
  return <Redirect to="/new-route" />
}
```
