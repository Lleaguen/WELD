/**
 * @weldjs/react — <Weld.Dropdown />
 *
 * Contextual menu triggered by a button or any element.
 * Closes on outside click or Escape.
 *
 * Usage:
 *   <Weld.Dropdown
 *     trigger={<Weld.Button variant="ghost" size="sm">Options ▾</Weld.Button>}
 *     items={[
 *       { label: 'Edit',   icon: '✏', onClick: handleEdit },
 *       { label: 'Delete', icon: '✕', onClick: handleDelete, variant: 'danger' },
 *       { divider: true },
 *       { label: 'Export', icon: '↓', onClick: handleExport },
 *     ]}
 *   />
 */

import React, { useState, useRef, useEffect, type ReactNode } from 'react'

export interface WeldDropdownItem {
  label?:    string
  icon?:     string | ReactNode
  onClick?:  () => void
  variant?:  'default' | 'danger'
  disabled?: boolean
  divider?:  boolean
}

export interface WeldDropdownProps {
  trigger:   ReactNode
  items:     WeldDropdownItem[]
  align?:    'left' | 'right'
  style?:    React.CSSProperties
}

if (typeof document !== 'undefined') {
  const id = '__weld_dropdown__'
  if (!document.getElementById(id)) {
    const s = document.createElement('style')
    s.id = id
    s.textContent = `
      @keyframes _weld-dropdown-in {
        from { opacity: 0; transform: translateY(-4px) scale(0.98); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
      }
    `
    document.head.appendChild(s)
  }
}

export function Dropdown({ trigger, items, align = 'left', style }: WeldDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const keyHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', keyHandler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', keyHandler)
    }
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex', ...style }} data-weld-dropdown>
      {/* Trigger */}
      <div onClick={() => setOpen((o) => !o)} style={{ cursor: 'pointer' }}>
        {trigger}
      </div>

      {/* Menu */}
      {open && (
        <div
          data-weld-dropdown-menu
          style={{
            position:     'absolute',
            top:          'calc(100% + 6px)',
            ...(align === 'right' ? { right: 0 } : { left: 0 }),
            zIndex:       400,
            minWidth:     '160px',
            background:   'var(--weld-bg-elevated, #111115)',
            border:       '1px solid rgba(255,255,255,0.08)',
            borderRadius: 'var(--weld-radius-lg, 8px)',
            boxShadow:    '0 8px 32px rgba(0,0,0,0.5)',
            padding:      '4px',
            animation:    '_weld-dropdown-in 0.15s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {items.map((item, i) => {
            if (item.divider) {
              return (
                <div key={i} style={{
                  height:  '1px',
                  background: 'var(--weld-border, rgba(255,255,255,0.06))',
                  margin:  '4px 0',
                }} />
              )
            }

            const isDanger = item.variant === 'danger'

            return (
              <button
                key={i}
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick?.()
                    setOpen(false)
                  }
                }}
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          '8px',
                  width:        '100%',
                  padding:      '7px 10px',
                  background:   'transparent',
                  border:       'none',
                  borderRadius: 'var(--weld-radius, 5px)',
                  cursor:       item.disabled ? 'not-allowed' : 'pointer',
                  fontSize:     '0.8125rem',
                  fontFamily:   'inherit',
                  color:        isDanger
                    ? '#ef4444'
                    : 'var(--weld-text-secondary, #a1a1aa)',
                  opacity:      item.disabled ? 0.4 : 1,
                  textAlign:    'left',
                  transition:   'background 0.1s, color 0.1s',
                }}
                onMouseEnter={(e) => {
                  if (!item.disabled) {
                    (e.currentTarget as HTMLElement).style.background = isDanger
                      ? 'rgba(239,68,68,0.08)'
                      : 'rgba(255,255,255,0.05)';
                    (e.currentTarget as HTMLElement).style.color = isDanger
                      ? '#ef4444'
                      : 'var(--weld-text-primary, #f4f4f5)'
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = isDanger
                    ? '#ef4444'
                    : 'var(--weld-text-secondary, #a1a1aa)'
                }}
              >
                {item.icon && <span style={{ fontSize: '0.85em', flexShrink: 0 }}>{item.icon}</span>}
                {item.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
