---
title: Primitive Components
description: Button, Input, Text, Heading, Badge, Divider, Avatar, Breadcrumb, Tabs.
---

## Button

Directly welded to a network promise. Manages loading, success, and error states automatically.

```tsx
<Weld.Button
  action={() => api.post('users', Schema, { body })}
  variant="primary"
  size="md"
>
  Create User
</Weld.Button>
```

| Prop | Type | Default |
|---|---|---|
| `action` | `() => WeldResponse \| Promise` | — |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `showSuccess` | `boolean` | `true` |
| `neon` | `boolean \| NeonConfig \| 'none'` | `true` |

## Input

Universal input — renders as text, textarea, select, date picker, etc.

```tsx
<Weld.Input
  type="email"
  label="Email"
  schema={z.string().email()}
  placeholder="you@example.com"
/>

<Weld.Input type="multiline" label="Notes" />

<Weld.Input
  type="select"
  label="Role"
  options={['admin', 'editor', 'viewer']}
/>
```

| Prop | Type | Default |
|---|---|---|
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'multiline' \| 'select' \| 'date' \| 'url' \| 'tel'` | `'text'` |
| `schema` | `ZodSchema` | — |
| `label` | `string` | — |
| `error` | `string` | — |
| `hint` | `string` | — |

## Text & Heading

```tsx
<Weld.Heading level={1}>Dashboard</Weld.Heading>
<Weld.Heading level={2}>Recent Activity</Weld.Heading>

<Weld.Text>Regular paragraph text.</Weld.Text>
<Weld.Text variant="muted">Subtle secondary text.</Weld.Text>
<Weld.Text variant="code" as="span">api.get('users')</Weld.Text>
```

## Badge

```tsx
<Weld.Badge variant="success" dot>Active</Weld.Badge>
<Weld.Badge variant="error">Failed</Weld.Badge>
<Weld.Badge variant="warning">Pending</Weld.Badge>
```

## Avatar

```tsx
<Weld.Avatar name="Franco Romero" size="md" status="online" />
<Weld.Avatar src="/photo.jpg" name="Franco Romero" size="lg" />
```

## Breadcrumb

```tsx
<Weld.Breadcrumb items={[
  { label: 'Dashboard', href: '/' },
  { label: 'Users',     href: '/users' },
  { label: 'Franco Romero' },
]} />
```

## Tabs

```tsx
<Weld.Tabs
  items={[
    { id: 'overview', label: 'Overview', content: <Overview /> },
    { id: 'settings', label: 'Settings', badge: 3, content: <Settings /> },
  ]}
/>
```
