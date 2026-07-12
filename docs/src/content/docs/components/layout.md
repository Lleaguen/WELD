---
title: Layout Components
description: Shell, Header, Sidebar, Main, Footer, Section, Card, Stack, Grid.
---

## Shell

Root layout container. Must wrap all other layout components.

```tsx
<Weld.Shell>
  <Weld.Header />
  <div style={{ display: 'flex' }}>
    <Weld.Sidebar />
    <Weld.Main />
  </div>
  <Weld.Footer />
</Weld.Shell>
```

| Prop | Type | Default |
|---|---|---|
| `noStyle` | `boolean` | `false` |

## Header

Sticky/fixed top bar with automatic online/offline dot and mobile hamburger.

```tsx
<Weld.Header fixed neon>
  <span>My App</span>
</Weld.Header>
```

| Prop | Type | Default |
|---|---|---|
| `fixed` | `boolean` | `false` |
| `neon` | `boolean \| NeonConfig \| 'none'` | `true` |

## Sidebar

Responsive sidebar — drawer on mobile, collapsed on tablet, expanded on desktop.

```tsx
<Weld.Sidebar position="left" collapsible width={240}>
  <Weld.Button variant="ghost">Dashboard</Weld.Button>
  <Weld.Button variant="ghost">Users</Weld.Button>
</Weld.Sidebar>
```

| Prop | Type | Default |
|---|---|---|
| `position` | `'left' \| 'right'` | `'left'` |
| `collapsible` | `boolean` | `true` |
| `width` | `number` | `232` |
| `collapsedWidth` | `number` | `52` |
| `responsive` | `ResponsiveConfig` | drawer/collapsed/expanded |

## Main

Main content area. Automatically offsets for Header height.

```tsx
<Weld.Main maxWidth={860} centered>
  {/* page content */}
</Weld.Main>
```

## Section

Semantic content block with title, description and optional divider.

```tsx
<Weld.Section
  title="Users"
  description="Manage your team"
  actions={<Weld.Button size="sm">Add User</Weld.Button>}
>
  <Weld.Table ... />
</Weld.Section>
```

## Card

Elevated surface with optional header and footer.

```tsx
<Weld.Card title="Details" accent>
  <Weld.Text>Content here</Weld.Text>
</Weld.Card>
```

## Stack

Flex container for consistent spacing.

```tsx
<Weld.Stack direction="column" gap={12}>
  <Weld.Input label="Name" />
  <Weld.Input label="Email" />
  <Weld.Button>Submit</Weld.Button>
</Weld.Stack>
```

## Grid

CSS Grid with responsive columns.

```tsx
<Weld.Grid cols={3} gap={16}>
  <Weld.Stat label="Users" value="1,284" />
  <Weld.Stat label="Active" value="847" />
  <Weld.Stat label="Revenue" value="$42k" accent />
</Weld.Grid>
```
