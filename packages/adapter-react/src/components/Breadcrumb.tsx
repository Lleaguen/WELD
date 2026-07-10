/**
 * @weldjs/react — <Weld.Breadcrumb />
 *
 * Navigation trail for hierarchical routes.
 *
 * Usage:
 *   <Weld.Breadcrumb items={[
 *     { label: 'Dashboard', href: '/' },
 *     { label: 'Users',     href: '/users' },
 *     { label: 'Franco Romero' },
 *   ]} />
 */

import React from 'react'

export interface WeldBreadcrumbItem {
  label:   string
  href?:   string
  onClick?: () => void
}

export interface WeldBreadcrumbProps {
  items:      WeldBreadcrumbItem[]
  separator?: string | React.ReactNode
  style?:     React.CSSProperties
}

export function Breadcrumb({ items, separator = '/', style }: WeldBreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" data-weld-breadcrumb style={style}>
      <ol style={{
        display:    'flex',
        alignItems: 'center',
        gap:        '6px',
        listStyle:  'none',
        margin:     0,
        padding:    0,
        flexWrap:   'wrap',
      }}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          const isLink = !isLast && (item.href || item.onClick)

          return (
            <li
              key={i}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              aria-current={isLast ? 'page' : undefined}
            >
              {isLink ? (
                <a
                  href={item.href}
                  onClick={item.onClick ? (e) => { e.preventDefault(); item.onClick!() } : undefined}
                  style={{
                    fontSize:        '0.8125rem',
                    color:           'var(--weld-text-muted, #52525b)',
                    textDecoration:  'none',
                    transition:      'color 0.15s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--weld-text-primary, #f4f4f5)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--weld-text-muted, #52525b)' }}
                >
                  {item.label}
                </a>
              ) : (
                <span style={{
                  fontSize:   '0.8125rem',
                  color:      isLast
                    ? 'var(--weld-text-primary, #f4f4f5)'
                    : 'var(--weld-text-muted, #52525b)',
                  fontWeight: isLast ? 500 : 400,
                }}>
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span style={{
                  fontSize: '0.75rem',
                  color:    'var(--weld-text-muted, #52525b)',
                  opacity:  0.5,
                  userSelect: 'none',
                }}>
                  {separator}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
