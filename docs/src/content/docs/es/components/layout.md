---
title: Componentes de Layout
description: Shell, Header, Sidebar, Main, Footer, Section, Card, Stack, Grid.
---

## Shell

Contenedor raíz del layout. Debe envolver todos los demás componentes de layout.

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

| Prop | Tipo | Por defecto |
|---|---|---|
| `noStyle` | `boolean` | `false` |

## Header

Barra superior fija con punto de estado online/offline automático y hamburguesa para mobile.

```tsx
<Weld.Header fixed neon>
  <span>Mi App</span>
</Weld.Header>
```

| Prop | Tipo | Por defecto |
|---|---|---|
| `fixed` | `boolean` | `false` |
| `neon` | `boolean \| NeonConfig \| 'none'` | `true` |

## Sidebar

Sidebar responsivo — drawer en mobile, colapsado en tablet, expandido en desktop.

```tsx
<Weld.Sidebar position="left" collapsible width={240}>
  <Weld.Button variant="ghost">Dashboard</Weld.Button>
  <Weld.Button variant="ghost">Usuarios</Weld.Button>
</Weld.Sidebar>
```

| Prop | Tipo | Por defecto |
|---|---|---|
| `position` | `'left' \| 'right'` | `'left'` |
| `collapsible` | `boolean` | `true` |
| `width` | `number` | `232` |
| `collapsedWidth` | `number` | `52` |

## Main

Área de contenido principal. Compensa automáticamente la altura del Header.

```tsx
<Weld.Main maxWidth={860} centered>
  {/* contenido de la página */}
</Weld.Main>
```

## Section

Bloque de contenido semántico con título, descripción y divisor opcional.

```tsx
<Weld.Section
  title="Usuarios"
  description="Gestioná tu equipo"
  actions={<Weld.Button size="sm">Agregar Usuario</Weld.Button>}
>
  <Weld.Table ... />
</Weld.Section>
```

## Card

Superficie elevada con header y footer opcionales.

```tsx
<Weld.Card title="Detalles" accent>
  <Weld.Text>Contenido aquí</Weld.Text>
</Weld.Card>
```

## Stack

Contenedor flex para espaciado consistente.

```tsx
<Weld.Stack direction="column" gap={12}>
  <Weld.Input label="Nombre" />
  <Weld.Input label="Email" />
  <Weld.Button>Enviar</Weld.Button>
</Weld.Stack>
```

## Grid

CSS Grid con columnas responsivas.

```tsx
<Weld.Grid cols={3} gap={16}>
  <Weld.Stat label="Usuarios" value="1.284" />
  <Weld.Stat label="Activos"  value="847" />
  <Weld.Stat label="Ingresos" value="$42k" accent />
</Weld.Grid>
```
