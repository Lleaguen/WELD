---
title: Componentes de Feedback
description: Alert, Spinner, Skeleton, Empty, Toast.
---

## Alert

Mensaje de feedback inline.

```tsx
<Weld.Alert variant="error" title="Petición fallida">
  Verificá tu conexión de red e intentá de nuevo.
</Weld.Alert>

<Weld.Alert variant="success">Usuario creado exitosamente.</Weld.Alert>
<Weld.Alert variant="warning">Tu sesión expira en 5 minutos.</Weld.Alert>
<Weld.Alert variant="info">Nueva versión disponible.</Weld.Alert>
```

## Spinner

```tsx
<Weld.Spinner />
<Weld.Spinner size="lg" label="Obteniendo datos..." />
```

## Skeleton

```tsx
<Weld.Skeleton width="100%" height={20} />
<Weld.Skeleton variant="circle" width={40} height={40} />
<Weld.Skeleton variant="text" lines={3} />
```

## Empty

```tsx
<Weld.Empty
  icon="📭"
  title="Sin posts todavía"
  description="Creá tu primer post para empezar."
  action={<Weld.Button size="sm">Crear Post</Weld.Button>}
/>
```

## Toast

Montá `ToastProvider` una vez en la raíz de tu app, luego llamá `toast` desde cualquier lugar.

```tsx
// Raíz de la app
import { Weld, toast } from '@weldjs/react'

function App() {
  return (
    <Weld.Shell>
      {/* ... */}
      <Weld.ToastProvider position="bottom-right" />
    </Weld.Shell>
  )
}

// En cualquier parte de tu app
toast.success('Usuario creado')
toast.error('Petición fallida')
toast.info('Sincronizando cola...')

// Con una promise de WeldResponse
toast.promise(api.post('users', Schema, { body }), {
  loading: 'Creando usuario...',
  success: '¡Usuario creado!',
  error:   'Error al crear usuario',
})
```
