/**
 * @weldjs/react — <Weld.Tabs />
 *
 * Tab navigation. Controlled or uncontrolled.
 *
 * Usage:
 *   <Weld.Tabs
 *     items={[
 *       { id: 'overview', label: 'Overview', content: <Overview /> },
 *       { id: 'settings', label: 'Settings', content: <Settings /> },
 *     ]}
 *   />
 *
 *   // Controlled:
 *   <Weld.Tabs items={tabs} value={tab} onChange={setTab} />
 */

import React, { useState, type ReactNode } from 'react'

export interface WeldTabItem {
  id:       string
  label:    string
  icon?:    string | ReactNode
  badge?:   string | number
  content?: ReactNode
  disabled?: boolean
}

export interface WeldTabsProps {
  items:     WeldTabItem[]
  value?:    string
  onChange?: (id: string) => void
  style?:    React.CSSProperties
}

export function Tabs({ items, value, onChange, style }: WeldTabsProps) {
  const [internal, setInternal] = useState(items[0]?.id ?? '')
  const active = value ?? internal

  const handleChange = (id: string) => {
    if (!value) setInternal(id)
    onChange?.(id)
  }

  const activeItem = items.find((i) => i.id === active)

  return (
    <div data-weld-tabs style={style}>
      {/* Tab bar */}
      <div style={{
        display:      'flex',
        gap:          '2px',
        borderBottom: '1px solid var(--weld-border, rgba(255,255,255,0.06))',
        marginBottom: '20px',
        overflowX:    'auto',
      }}>
        {items.map((item) => {
          const isActive = item.id === active
          return (
            <button
              key={item.id}
              onClick={() => !item.disabled && handleChange(item.id)}
              disabled={item.disabled}
              style={{
                display:       'inline-flex',
                alignItems:    'center',
                gap:           '6px',
                padding:       '8px 14px',
                fontSize:      '0.8125rem',
                fontWeight:    isActive ? 500 : 400,
                fontFamily:    'inherit',
                background:    'transparent',
                border:        'none',
                borderBottom:  isActive
                  ? '1.5px solid var(--weld-plasma-cyan, #00d4ff)'
                  : '1.5px solid transparent',
                marginBottom:  '-1px',
                color:         isActive
                  ? 'var(--weld-text-primary, #f4f4f5)'
                  : 'var(--weld-text-muted, #52525b)',
                cursor:        item.disabled ? 'not-allowed' : 'pointer',
                opacity:       item.disabled ? 0.4 : 1,
                transition:    'color 0.15s, border-color 0.15s',
                whiteSpace:    'nowrap',
                outline:       'none',
              }}
            >
              {item.icon && <span style={{ fontSize: '0.9em' }}>{item.icon}</span>}
              {item.label}
              {item.badge !== undefined && (
                <span style={{
                  padding:      '1px 6px',
                  fontSize:     '0.65rem',
                  fontWeight:   500,
                  borderRadius: '999px',
                  background:   isActive ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.06)',
                  color:        isActive ? 'var(--weld-plasma-cyan, #00d4ff)' : 'var(--weld-text-muted, #52525b)',
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Panel */}
      {activeItem?.content && (
        <div data-weld-tab-panel>
          {activeItem.content}
        </div>
      )}
    </div>
  )
}
