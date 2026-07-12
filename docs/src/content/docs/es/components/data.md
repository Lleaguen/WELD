---
title: Visualización de Datos
description: Table, Stat.
---

## Table

Tabla de datos tipada con skeleton de carga y estado vacío.

```tsx
<Weld.Table
  columns={[
    { key: 'id',    label: '#',      width: 60 },
    { key: 'name',  label: 'Nombre' },
    { key: 'email', label: 'Email',
      render: (v) => <Weld.Text variant="code" as="span">{String(v)}</Weld.Text>
    },
    { key: 'role',  label: 'Rol',
      render: (v) => <Weld.Badge variant={v === 'admin' ? 'primary' : 'default'}>{String(v)}</Weld.Badge>
    },
  ]}
  data={users}
  keyField="id"
  loading={loading}
  onRowClick={(row) => navigate(`/users/${row.id}`)}
  empty={<Weld.Empty title="Sin usuarios" />}
/>
```

| Prop | Tipo | Por defecto |
|---|---|---|
| `columns` | `WeldTableColumn<T>[]` | requerido |
| `data` | `T[]` | requerido |
| `keyField` | `keyof T` | requerido |
| `loading` | `boolean` | `false` |
| `onRowClick` | `(row: T) => void` | — |
| `empty` | `ReactNode` | `'Sin datos'` |

## Stat

Visualización de métricas KPI para dashboards.

```tsx
<Weld.Grid cols={4} gap={16}>
  <Weld.Card>
    <Weld.Stat label="Usuarios Totales"  value="1.284" trend="+12%" trendUp />
  </Weld.Card>
  <Weld.Card>
    <Weld.Stat label="Activos Ahora"     value="347" accent />
  </Weld.Card>
  <Weld.Card>
    <Weld.Stat label="Latencia Promedio" value="42ms" />
  </Weld.Card>
  <Weld.Card>
    <Weld.Stat label="Tasa de Errores"   value="0.3%" trend="-0.1%" />
  </Weld.Card>
</Weld.Grid>
```
