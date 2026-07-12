---
title: useForm
description: Gestioná el estado del formulario, validación y envío con useForm.
---

Instalar:

```bash
npm install @weldjs/forms
```

## Uso básico

```tsx
import { useForm } from '@weldjs/forms'
import { Weld } from '@weldjs/react'
import { z } from 'zod'
import { api } from '../lib/api'

const CreateUserSchema = z.object({
  name:  z.string().min(2),
  email: z.string().email(),
  role:  z.enum(['admin', 'editor', 'viewer']),
})

type CreateUser = z.infer<typeof CreateUserSchema>

export function CreateUserForm() {
  const form = useForm<CreateUser>({
    initialValues: { name: '', email: '', role: 'viewer' },
    schema: CreateUserSchema,
    onSubmit:  (values) => api.post('users', CreateUserSchema, { body: values }),
    onSuccess: () => toast.success('¡Usuario creado!'),
    onError:   (err) => toast.error(err.message),
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <Weld.Stack gap={12}>
        <Weld.Input label="Nombre" {...form.register('name')} />
        <Weld.Input label="Email"  type="email" {...form.register('email')} />
        <Weld.Input
          label="Rol"
          type="select"
          options={['admin', 'editor', 'viewer']}
          {...form.register('role')}
        />
        <Weld.Button type="submit" disabled={form.isSubmitting}>
          {form.isSubmitting ? 'Creando...' : 'Crear Usuario'}
        </Weld.Button>
      </Weld.Stack>
    </form>
  )
}
```

## Valores de retorno

| Propiedad | Tipo | Descripción |
|---|---|---|
| `values` | `T` | Valores actuales de los campos |
| `errors` | `FieldErrors<T>` | Errores de validación por campo |
| `touched` | `FieldTouched<T>` | Qué campos han perdido el foco |
| `status` | `FormStatus` | `'idle' \| 'submitting' \| 'success' \| 'error'` |
| `isSubmitting` | `boolean` | — |
| `isValid` | `boolean` | Sin errores actuales |
| `isDirty` | `boolean` | Los valores difieren de initialValues |
| `register(name)` | `fn` | Devuelve props para spreadear en `<Weld.Input>` |
| `setValue(name, val)` | `fn` | Establece un campo programáticamente |
| `setError(name, msg)` | `fn` | Establece un error de campo desde afuera |
| `handleSubmit` | `fn` | Adjuntá a `<form onSubmit>` |
| `reset()` | `fn` | Resetea a los valores iniciales |
