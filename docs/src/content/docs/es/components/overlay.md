---
title: Componentes Overlay
description: Modal, Tooltip, Dropdown.
---

## Modal

```tsx
const [open, setOpen] = useState(false)

<Weld.Button action={() => { setOpen(true); return Promise.resolve() }}>
  Abrir Modal
</Weld.Button>

<Weld.Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Confirmar Eliminación"
  width={480}
>
  <Weld.Text>Esta acción no se puede deshacer.</Weld.Text>
  <Weld.Stack direction="row" justify="flex-end" gap={8} style={{ marginTop: 16 }}>
    <Weld.Button
      variant="ghost"
      action={() => { setOpen(false); return Promise.resolve() }}
    >
      Cancelar
    </Weld.Button>
    <Weld.Button variant="danger" action={handleDelete}>
      Eliminar
    </Weld.Button>
  </Weld.Stack>
</Weld.Modal>
```

Se cierra al hacer clic en el backdrop o con `Escape`. Bloquea el scroll del body mientras está abierto.

## Tooltip

```tsx
<Weld.Tooltip content="Eliminar este registro" position="top">
  <Weld.Button variant="danger" size="sm">✕</Weld.Button>
</Weld.Tooltip>
```

| Prop | Tipo | Por defecto |
|---|---|---|
| `content` | `string \| ReactNode` | requerido |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` |
| `delay` | `number` (ms) | `400` |

## Dropdown

```tsx
<Weld.Dropdown
  trigger={<Weld.Button variant="ghost" size="sm">Opciones ▾</Weld.Button>}
  align="right"
  items={[
    { label: 'Editar',    icon: '✏', onClick: handleEdit },
    { label: 'Exportar',  icon: '↓', onClick: handleExport },
    { divider: true },
    { label: 'Eliminar',  icon: '✕', onClick: handleDelete, variant: 'danger' },
  ]}
/>
```

Se cierra al hacer clic fuera o con `Escape`.
