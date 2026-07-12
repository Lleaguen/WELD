---
title: Data Display
description: Table, Stat.
---

## Table

Typed data table with loading skeleton and empty state.

```tsx
<Weld.Table
  columns={[
    { key: 'id',    label: '#',     width: 60 },
    { key: 'name',  label: 'Name' },
    { key: 'email', label: 'Email',
      render: (v) => <Weld.Text variant="code" as="span">{String(v)}</Weld.Text>
    },
    { key: 'role',  label: 'Role',
      render: (v) => <Weld.Badge variant={v === 'admin' ? 'primary' : 'default'}>{String(v)}</Weld.Badge>
    },
  ]}
  data={users}
  keyField="id"
  loading={loading}
  onRowClick={(row) => navigate(`/users/${row.id}`)}
  empty={<Weld.Empty title="No users found" />}
/>
```

| Prop | Type | Default |
|---|---|---|
| `columns` | `WeldTableColumn<T>[]` | required |
| `data` | `T[]` | required |
| `keyField` | `keyof T` | required |
| `loading` | `boolean` | `false` |
| `onRowClick` | `(row: T) => void` | — |
| `empty` | `ReactNode` | `'No data'` |

## Stat

KPI metric display for dashboards.

```tsx
<Weld.Grid cols={4} gap={16}>
  <Weld.Card>
    <Weld.Stat label="Total Users"  value="1,284" trend="+12%" trendUp />
  </Weld.Card>
  <Weld.Card>
    <Weld.Stat label="Active Now"   value="347" accent />
  </Weld.Card>
  <Weld.Card>
    <Weld.Stat label="Avg Latency"  value="42ms" />
  </Weld.Card>
  <Weld.Card>
    <Weld.Stat label="Error Rate"   value="0.3%" trend="-0.1%" />
  </Weld.Card>
</Weld.Grid>
```
