---
title: Feedback Components
description: Alert, Spinner, Skeleton, Empty, Toast.
---

## Alert

Inline feedback message.

```tsx
<Weld.Alert variant="error" title="Request failed">
  Check your network connection and try again.
</Weld.Alert>

<Weld.Alert variant="success">User created successfully.</Weld.Alert>
<Weld.Alert variant="warning">Your session expires in 5 minutes.</Weld.Alert>
<Weld.Alert variant="info">New version available.</Weld.Alert>
```

## Spinner

```tsx
<Weld.Spinner />
<Weld.Spinner size="lg" label="Fetching data..." />
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
  title="No posts yet"
  description="Create your first post to get started."
  action={<Weld.Button size="sm">Create Post</Weld.Button>}
/>
```

## Toast

Mount `ToastProvider` once in your app root, then call `toast` anywhere.

```tsx
// App root
import { Weld, toast } from '@weldjs/react'

function App() {
  return (
    <Weld.Shell>
      {/* ... */}
      <Weld.ToastProvider position="bottom-right" />
    </Weld.Shell>
  )
}

// Anywhere in your app
toast.success('User created')
toast.error('Request failed')
toast.info('Syncing queue...')

// With a WeldResponse promise
toast.promise(api.post('users', Schema, { body }), {
  loading: 'Creating user...',
  success: 'User created!',
  error:   'Failed to create user',
})
```
