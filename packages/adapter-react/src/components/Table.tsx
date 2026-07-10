/**
 * @weldjs/react — <Weld.Table />
 *
 * Data table with WELD styling. Supports typed columns + row data.
 *
 * Usage:
 *   <Weld.Table
 *     columns={[
 *       { key: 'id',    label: '#',     width: 60 },
 *       { key: 'name',  label: 'Name' },
 *       { key: 'email', label: 'Email', render: (v) => <Weld.Text variant="code">{v}</Weld.Text> },
 *     ]}
 *     data={users}
 *     keyField="id"
 *   />
 */

import React, { type ReactNode } from 'react'

export interface WeldTableColumn<T> {
  key:      keyof T | string
  label:    string
  width?:   number | string
  align?:   'left' | 'center' | 'right'
  render?:  (value: unknown, row: T) => ReactNode
}

export interface WeldTableProps<T extends Record<string, unknown>> {
  columns:    WeldTableColumn<T>[]
  data:       T[]
  keyField:   keyof T
  loading?:   boolean
  empty?:     ReactNode
  onRowClick?: (row: T) => void
  style?:     React.CSSProperties
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  keyField,
  loading,
  empty,
  onRowClick,
  style,
}: WeldTableProps<T>) {
  const clickable = !!onRowClick

  return (
    <div
      data-weld-table
      style={{
        width:        '100%',
        overflowX:    'auto',
        border:       '1px solid var(--weld-border, rgba(255,255,255,0.06))',
        borderRadius: 'var(--weld-radius-lg, 8px)',
        ...style,
      }}
    >
      <table style={{
        width:           '100%',
        borderCollapse:  'collapse',
        fontSize:        '0.8125rem',
      }}>
        {/* Head */}
        <thead>
          <tr style={{
            borderBottom: '1px solid var(--weld-border, rgba(255,255,255,0.06))',
            background:   'rgba(255,255,255,0.02)',
          }}>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                style={{
                  padding:       '10px 14px',
                  textAlign:     col.align ?? 'left',
                  fontSize:      '0.7rem',
                  fontWeight:    500,
                  color:         'var(--weld-text-muted, #52525b)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  width:         col.width,
                  whiteSpace:    'nowrap',
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={String(col.key)} style={{ padding: '10px 14px' }}>
                    <div style={{
                      height:     '12px',
                      borderRadius: '3px',
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%)',
                      backgroundSize: '200% 100%',
                      animation: '_weld-shimmer 1.6s ease-in-out infinite',
                      width: `${60 + Math.random() * 30}%`,
                    }} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ padding: '40px 14px', textAlign: 'center', color: 'var(--weld-text-muted, #52525b)', fontSize: '0.8125rem' }}
              >
                {empty ?? 'No data'}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={String(row[keyField])}
                onClick={clickable ? () => onRowClick(row) : undefined}
                style={{
                  borderBottom:    '1px solid var(--weld-border, rgba(255,255,255,0.04))',
                  cursor:          clickable ? 'pointer' : undefined,
                  transition:      clickable ? 'background 0.1s' : undefined,
                }}
                onMouseEnter={clickable ? (e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' } : undefined}
                onMouseLeave={clickable ? (e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' } : undefined}
              >
                {columns.map((col) => {
                  const value = row[col.key as keyof T]
                  return (
                    <td
                      key={String(col.key)}
                      style={{
                        padding:   '10px 14px',
                        textAlign: col.align ?? 'left',
                        color:     'var(--weld-text-secondary, #a1a1aa)',
                      }}
                    >
                      {col.render ? col.render(value, row) : String(value ?? '')}
                    </td>
                  )
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
