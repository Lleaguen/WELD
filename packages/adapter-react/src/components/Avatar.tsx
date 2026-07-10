/**
 * @weldjs/react — <Weld.Avatar />
 *
 * User avatar — image with fallback to initials.
 *
 * Usage:
 *   <Weld.Avatar name="Franco Romero" />
 *   <Weld.Avatar src="/avatar.jpg" name="Franco Romero" size="lg" />
 *   <Weld.Avatar name="FR" status="online" />
 */

import React from 'react'

export interface WeldAvatarProps {
  name?:    string
  src?:     string
  size?:    'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status?:  'online' | 'offline' | 'away'
  style?:   React.CSSProperties
}

const sizeMap = { xs: 24, sm: 28, md: 36, lg: 44, xl: 56 }
const fontMap = { xs: '0.6rem', sm: '0.65rem', md: '0.8rem', lg: '0.9rem', xl: '1.1rem' }

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
}

// Deterministic color from name
function getColor(name: string): string {
  const colors = [
    '#3b6bff', '#00d4ff', '#22c55e', '#f59e0b',
    '#8b5cf6', '#ec4899', '#ef4444', '#06b6d4',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]!
}

const statusColors = {
  online:  '#22c55e',
  offline: 'var(--weld-text-muted, #52525b)',
  away:    '#f59e0b',
}

export function Avatar({ name = '', src, size = 'md', status, style }: WeldAvatarProps) {
  const px       = sizeMap[size]
  const fontSize = fontMap[size]
  const initials = getInitials(name)
  const color    = getColor(name)
  const statusPx = size === 'xs' || size === 'sm' ? 7 : 9

  return (
    <div
      data-weld-avatar
      style={{ position: 'relative', display: 'inline-flex', flexShrink: 0, ...style }}
    >
      <div style={{
        width:        `${px}px`,
        height:       `${px}px`,
        borderRadius: '50%',
        background:   src ? undefined : `${color}22`,
        border:       `1px solid ${src ? 'rgba(255,255,255,0.08)' : `${color}44`}`,
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'center',
        overflow:     'hidden',
        flexShrink:   0,
      }}>
        {src ? (
          <img
            src={src}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{
            fontSize,
            fontWeight: 600,
            color,
            userSelect: 'none',
            letterSpacing: '0.02em',
          }}>
            {initials || '?'}
          </span>
        )}
      </div>

      {/* Status dot */}
      {status && (
        <span style={{
          position:     'absolute',
          bottom:       0,
          right:        0,
          width:        `${statusPx}px`,
          height:       `${statusPx}px`,
          borderRadius: '50%',
          background:   statusColors[status],
          border:       '2px solid var(--weld-bg-base, #09090b)',
          boxShadow:    status === 'online' ? `0 0 6px ${statusColors.online}80` : 'none',
        }} />
      )}
    </div>
  )
}
