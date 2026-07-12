---
title: Form Validation
description: Schema-driven validation with Zod in WELD forms.
---

WELD uses Zod for all validation. The same schema validates the form AND the API response — one source of truth.

## Schema validation

Pass a Zod schema to `useForm`. Validation runs on blur and on submit.

```tsx
const schema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Invalid email address'),
  age:      z.number().min(18, 'Must be 18 or older'),
  password: z.string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter'),
})

const form = useForm({ initialValues: {...}, schema, onSubmit })
```

## Per-field validation on Input

For standalone inputs outside a form:

```tsx
<Weld.Input
  type="email"
  label="Email"
  schema={z.string().email()}
  placeholder="you@example.com"
/>
```

Errors appear below the field after blur, styled automatically.

## Validate on change

```tsx
const form = useForm({
  initialValues,
  schema,
  validateOnChange: true,  // default: false
  onSubmit,
})
```

## Manual errors

Set field errors programmatically (e.g. from API response):

```tsx
form.setError('email', 'This email is already taken')
```
