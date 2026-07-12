---
title: Componentes Primitivos
description: Button, Input, Text, Heading, Badge, Divider, Avatar, Breadcrumb, Tabs.
---

## Button

Directamente "soldado" a una promise de red. Gestiona los estados de carga, éxito y error automáticamente.

```tsx
<Weld.Button
  action={() => api.post('users', Schema, { body })}
  variant="primary"
  size="md"
>
  Crear Usuario
</Weld.Button>
```

| Prop | Tipo | Por defecto |
|---|---|---|
| `action` | `() => WeldResponse \| Promise` | — |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `showSuccess` | `boolean` | `true` |
| `neon` | `boolean \| NeonConfig \| 'none'` | `true` |

## Input

Input universal — renderiza como texto, textarea, select, date picker, etc.

```tsx
<Weld.Input
  type="email"
  label="Email"
  schema={z.string().email()}
  placeholder="vos@ejemplo.com"
/>

<Weld.Input type="multiline" label="Notas" />

<Weld.Input
  type="select"
  label="Rol"
  options={['admin', 'editor', 'viewer']}
/>
```

| Prop | Tipo | Por defecto |
|---|---|---|
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'multiline' \| 'select' \| 'date' \| 'url' \| 'tel'` | `'text'` |
| `schema` | `ZodSchema` | — |
| `label` | `string` | — |
| `error` | `string` | — |
| `hint` | `string` | — |

## Text y Heading

```tsx
<Weld.Heading level={1}>Dashboard</Weld.Heading>
<Weld.Heading level={2}>Actividad Reciente</Weld.Heading>

<Weld.Text>Texto de párrafo normal.</Weld.Text>
<Weld.Text variant="muted">Texto secundario sutil.</Weld.Text>
<Weld.Text variant="code" as="span">api.get('users')</Weld.Text>
```

## Badge

```tsx
<Weld.Badge variant="success" dot>Activo</Weld.Badge>
<Weld.Badge variant="error">Fallido</Weld.Badge>
<Weld.Badge variant="warning">Pendiente</Weld.Badge>
```

## Avatar

```tsx
<Weld.Avatar name="Franco Romero" size="md" status="online" />
<Weld.Avatar src="/foto.jpg" name="Franco Romero" size="lg" />
```

## Breadcrumb

```tsx
<Weld.Breadcrumb items={[
  { label: 'Dashboard', href: '/' },
  { label: 'Usuarios',  href: '/users' },
  { label: 'Franco Romero' },
]} />
```

## Tabs

```tsx
<Weld.Tabs
  items={[
    { id: 'overview', label: 'Resumen',        content: <Resumen /> },
    { id: 'settings', label: 'Configuración', badge: 3, content: <Config /> },
  ]}
/>
```
