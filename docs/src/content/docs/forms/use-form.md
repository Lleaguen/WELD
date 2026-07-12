---
title: useForm
description: Manage form state, validation and submission with useForm.
---

Install:

```bash
npm install @weldjs/forms
```

## Basic usage

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
    onSubmit: (values) => api.post('users', CreateUserSchema, { body: values }),
    onSuccess: () => toast.success('User created!'),
    onError:   (err) => toast.error(err.message),
  })

  return (
    <form onSubmit={form.handleSubmit}>
      <Weld.Stack gap={12}>
        <Weld.Input label="Name"  {...form.register('name')} />
        <Weld.Input label="Email" type="email" {...form.register('email')} />
        <Weld.Input
          label="Role"
          type="select"
          options={['admin', 'editor', 'viewer']}
          {...form.register('role')}
        />
        <Weld.Button type="submit" disabled={form.isSubmitting}>
          {form.isSubmitting ? 'Creating...' : 'Create User'}
        </Weld.Button>
      </Weld.Stack>
    </form>
  )
}
```

## Return values

| Property | Type | Description |
|---|---|---|
| `values` | `T` | Current field values |
| `errors` | `FieldErrors<T>` | Validation errors by field |
| `touched` | `FieldTouched<T>` | Which fields have been blurred |
| `status` | `FormStatus` | `'idle' \| 'submitting' \| 'success' \| 'error'` |
| `isSubmitting` | `boolean` | — |
| `isValid` | `boolean` | No current errors |
| `isDirty` | `boolean` | Values differ from initialValues |
| `register(name)` | `fn` | Returns props to spread onto `<Weld.Input>` |
| `setValue(name, val)` | `fn` | Set a field programmatically |
| `setError(name, msg)` | `fn` | Set a field error from outside |
| `handleSubmit` | `fn` | Attach to `<form onSubmit>` |
| `reset()` | `fn` | Reset to initial values |
