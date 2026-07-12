---
title: Validación de Formularios
description: Validación dirigida por schemas con Zod en los formularios WELD.
---

WELD usa Zod para toda validación. El mismo schema valida el formulario Y la respuesta de la API — una única fuente de verdad.

## Validación por schema

Pasá un schema Zod a `useForm`. La validación se ejecuta al perder el foco y al enviar.

```tsx
const schema = z.object({
  name:     z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email:    z.string().email('Email inválido'),
  age:      z.number().min(18, 'Debe tener 18 años o más'),
  password: z.string()
    .min(8, 'Al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener una letra mayúscula'),
})

const form = useForm({ initialValues: {...}, schema, onSubmit })
```

## Validación por campo en Input

Para inputs standalone fuera de un formulario:

```tsx
<Weld.Input
  type="email"
  label="Email"
  schema={z.string().email()}
  placeholder="vos@ejemplo.com"
/>
```

Los errores aparecen debajo del campo al perder el foco, con estilo automático.

## Validar al cambiar

```tsx
const form = useForm({
  initialValues,
  schema,
  validateOnChange: true,  // por defecto: false
  onSubmit,
})
```

## Errores manuales

Establecé errores de campo programáticamente (por ejemplo, desde la respuesta de la API):

```tsx
form.setError('email', 'Este email ya está en uso')
```
