/**
 * @weldjs/react — Toast / Notification system
 *
 * Floating feedback messages. Directly integrated with WeldResponse lifecycle.
 *
 * Setup (once, inside WeldProvider or App root):
 *   <Weld.ToastProvider />
 *
 * Usage anywhere:
 *   import { toast } from '@weldjs/react'
 *   toast.success('Post created')
 *   toast.error('Request failed')
 *   toast.info('Syncing queue...')
 *
 * With WeldResponse:
 *   toast.promise(api.post('posts', Schema, { body }), {
 *     loading: 'Creating post...',
 *     success: 'Post created!',
 *     error:   'Failed to create post',
 *   })
 */

import React, { useState, useEffect, useCallback, type ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'loading'

export interface ToastItem {
  id:       string
  variant:  ToastVariant
  message:  string
  duration: number  // ms, 0 = persistent
}

// ─── Internal store (singleton) ───────────────────────────────────────────────

type Listener = (toasts: ToastItem[]) => void
let _toasts:   ToastItem[] = []
let _listeners: Listener[] = []

function notify() {
  _listeners.forEach((l) => l([..._toasts]))
}

function addToast(item: Omit<ToastItem, 'id'>): string {
  const id = Math.random().toString(36).slice(2)
  _toasts = [..._toasts, { ...item, id }]
  notify()
  if (item.duration > 0) {
    setTimeout(() => removeToast(id), item.duration)
  }
  return id
}

function removeToast(id: string) {
  _toasts = _toasts.filter((t) => t.id !== id)
  notify()
}

function updateToast(id: string, update: Partial<ToastItem>) {
  _toasts = _toasts.map((t) => t.id === id ? { ...t, ...update } : t)
  notify()
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const toast = {
  success: (message: string, duration = 3500) =>
    addToast({ variant: 'success', message, duration }),

  error: (message: string, duration = 4500) =>
    addToast({ variant: 'error', message, duration }),

  warning: (message: string, duration = 4000) =>
    addToast({ variant: 'warning', message, duration }),

  info: (message: string, duration = 3500) =>
    addToast({ variant: 'info', message, duration }),

  loading: (message: string) =>
    addToast({ variant: 'loading', message, duration: 0 }),

  dismiss: (id: string) => removeToast(id),

  promise: async <T,>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
  ): Promise<T> => {
    const id = toast.loading(messages.loading)
    try {
      const result = await promise
      updateToast(id, { variant: 'success', message: messages.success, duration: 3500 })
      setTimeout(() => removeToast(id), 3500)
      return result
    } catch (err) {
      updateToast(id, { variant: 'error', message: messages.error, duration: 4500 })
      setTimeout(() => removeToast(id), 4500)
      throw err
    }
  },
}

// ─── Styles ───────────────────────────────────────────────────────────────────

if (typeof document !== 'undefined') {
  const id = '__weld_toast__'
  if (!document.getElementById(id)) {
    const s = document.createElement('style')
    s.id = id
    s.textContent = `
      @keyframes _weld-toast-in {
        from { opacity: 0; transform: translateX(12px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes _weld-toast-out {
        from { opacity: 1; transform: translateX(0); max-height: 80px; margin-bottom: 8px; }
        to   { opacity: 0; transform: translateX(12px); max-height: 0; margin-bottom: 0; }
      }
    `
    document.head.appendChild(s)
  }
}

const toastConfig: Record<ToastVariant, { icon: ReactNode; color: string; border: string; bg: string }> = {
  success: { icon: '✓', color: '#22c55e', border: 'rgba(34,197,94,0.20)',  bg: 'rgba(34,197,94,0.06)' },
  error:   { icon: '✕', color: '#ef4444', border: 'rgba(239,68,68,0.20)',  bg: 'rgba(239,68,68,0.06)' },
  warning: { icon: '⚠', color: '#f59e0b', border: 'rgba(245,158,11,0.20)', bg: 'rgba(245,158,11,0.06)' },
  info:    { icon: 'ℹ', color: 'var(--weld-plasma-cyan, #00d4ff)', border: 'rgba(0,212,255,0.20)', bg: 'rgba(0,212,255,0.06)' },
  loading: { icon: null, color: 'var(--weld-text-secondary, #a1a1aa)', border: 'rgba(255,255,255,0.08)', bg: 'var(--weld-bg-elevated, #111115)' },
}

// ─── ToastProvider ────────────────────────────────────────────────────────────

export interface WeldToastProviderProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

export function ToastProvider({ position = 'bottom-right' }: WeldToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const listener: Listener = (t) => setToasts(t)
    _listeners.push(listener)
    return () => { _listeners = _listeners.filter((l) => l !== listener) }
  }, [])

  const posStyles: React.CSSProperties = {
    position: 'fixed',
    zIndex:   9999,
    display:  'flex',
    flexDirection: position.startsWith('bottom') ? 'column-reverse' : 'column',
    gap:      '8px',
    ...(position.includes('right')  ? { right: '20px' }  : {}),
    ...(position.includes('left')   ? { left: '20px' }   : {}),
    ...(position.includes('center') ? { left: '50%', transform: 'translateX(-50%)' } : {}),
    ...(position.startsWith('top')  ? { top: '20px' }    : {}),
    ...(position.startsWith('bottom') ? { bottom: '20px' } : {}),
    pointerEvents: 'none',
  }

  return (
    <div data-weld-toast-provider style={posStyles}>
      {toasts.map((t) => (
        <ToastItem key={t.id} item={t} onDismiss={() => removeToast(t.id)} />
      ))}
    </div>
  )
}

// ─── Single toast item ────────────────────────────────────────────────────────

function ToastItem({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const cfg = toastConfig[item.variant]

  return (
    <div
      data-weld-toast
      data-variant={item.variant}
      style={{
        display:      'flex',
        alignItems:   'center',
        gap:          '10px',
        padding:      '11px 14px',
        minWidth:     '260px',
        maxWidth:     '360px',
        background:   cfg.bg,
        border:       `1px solid ${cfg.border}`,
        borderRadius: 'var(--weld-radius-lg, 8px)',
        backdropFilter: 'blur(12px)',
        boxShadow:    '0 4px 24px rgba(0,0,0,0.4)',
        animation:    '_weld-toast-in 0.2s cubic-bezier(0.16,1,0.3,1)',
        pointerEvents: 'all',
        cursor:       'pointer',
      }}
      onClick={onDismiss}
    >
      {/* Icon */}
      <span style={{ fontSize: '0.8rem', color: cfg.color, fontWeight: 600, flexShrink: 0 }}>
        {item.variant === 'loading'
          ? <span style={{
              width: '12px', height: '12px',
              borderRadius: '50%',
              border: '1.5px solid rgba(255,255,255,0.15)',
              borderTopColor: 'var(--weld-plasma-cyan, #00d4ff)',
              display: 'inline-block',
              animation: '_weld-rotate 0.65s linear infinite',
            }} />
          : cfg.icon
        }
      </span>

      {/* Message */}
      <span style={{
        flex:       1,
        fontSize:   '0.8125rem',
        color:      'var(--weld-text-primary, #f4f4f5)',
        lineHeight: 1.4,
      }}>
        {item.message}
      </span>

      {/* Dismiss */}
      <button
        onClick={(e) => { e.stopPropagation(); onDismiss() }}
        style={{
          background:   'transparent',
          border:       'none',
          cursor:       'pointer',
          color:        'var(--weld-text-muted, #52525b)',
          padding:      '2px',
          flexShrink:   0,
          display:      'flex',
          alignItems:   'center',
        }}
        aria-label="Dismiss"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
