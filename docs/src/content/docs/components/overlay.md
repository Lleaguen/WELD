---
title: Overlay Components
description: Modal, Tooltip, Dropdown.
---

## Modal

```tsx
const [open, setOpen] = useState(false)

<Weld.Button action={() => { setOpen(true); return Promise.resolve() }}>
  Open Modal
</Weld.Button>

<Weld.Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Confirm Delete"
  width={480}
>
  <Weld.Text>This action cannot be undone.</Weld.Text>
  <Weld.Stack direction="row" justify="flex-end" gap={8} style={{ marginTop: 16 }}>
    <Weld.Button
      variant="ghost"
      action={() => { setOpen(false); return Promise.resolve() }}
    >
      Cancel
    </Weld.Button>
    <Weld.Button variant="danger" action={handleDelete}>
      Delete
    </Weld.Button>
  </Weld.Stack>
</Weld.Modal>
```

Closes on backdrop click or `Escape`. Locks body scroll while open.

## Tooltip

```tsx
<Weld.Tooltip content="Delete this record" position="top">
  <Weld.Button variant="danger" size="sm">✕</Weld.Button>
</Weld.Tooltip>
```

| Prop | Type | Default |
|---|---|---|
| `content` | `string \| ReactNode` | required |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` |
| `delay` | `number` (ms) | `400` |

## Dropdown

```tsx
<Weld.Dropdown
  trigger={<Weld.Button variant="ghost" size="sm">Options ▾</Weld.Button>}
  align="right"
  items={[
    { label: 'Edit',   icon: '✏', onClick: handleEdit },
    { label: 'Export', icon: '↓', onClick: handleExport },
    { divider: true },
    { label: 'Delete', icon: '✕', onClick: handleDelete, variant: 'danger' },
  ]}
/>
```

Closes on outside click or `Escape`.
