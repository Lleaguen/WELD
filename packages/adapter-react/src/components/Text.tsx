/**
 * @weldjs/react — <Weld.Text /> + <Weld.Heading />
 *
 * Typography primitives with semantic variants.
 *
 * Usage:
 *   <Weld.Heading level={1}>Dashboard</Weld.Heading>
 *   <Weld.Text variant="muted">Last updated 2 min ago</Weld.Text>
 *   <Weld.Text variant="code">api.get('users')</Weld.Text>
 */

import React, { type ReactNode } from 'react'

// ─── Text ─────────────────────────────────────────────────────────────────────

export interface WeldTextProps {
  children?:  ReactNode
  variant?:   'primary' | 'secondary' | 'muted' | 'code' | 'label' | 'caption'
  size?:      'xs' | 'sm' | 'md' | 'lg'
  weight?:    'normal' | 'medium' | 'semibold' | 'bold'
  truncate?:  boolean
  as?:        'p' | 'span' | 'div' | 'label' | 'small'
  className?: string
  style?:     React.CSSProperties
}

const textColors: Record<NonNullable<WeldTextProps['variant']>, string> = {
  primary:   'var(--weld-text-primary, #f4f4f5)',
  secondary: 'var(--weld-text-secondary, #a1a1aa)',
  muted:     'var(--weld-text-muted, #52525b)',
  code:      'var(--weld-plasma-cyan, #00d4ff)',
  label:     'var(--weld-text-secondary, #a1a1aa)',
  caption:   'var(--weld-text-muted, #52525b)',
}

const textSizes: Record<NonNullable<WeldTextProps['size']>, string> = {
  xs: '0.7rem',
  sm: '0.8125rem',
  md: '0.875rem',
  lg: '1rem',
}

const textWeights: Record<NonNullable<WeldTextProps['weight']>, number> = {
  normal:   400,
  medium:   500,
  semibold: 600,
  bold:     700,
}

export function Text({
  children,
  variant = 'secondary',
  size = 'md',
  weight = 'normal',
  truncate = false,
  as: Tag = 'p',
  className,
  style,
}: WeldTextProps) {
  const isCode = variant === 'code'
  const isCaption = variant === 'caption' || variant === 'label'

  return (
    <Tag
      className={className}
      data-weld-text
      style={{
        margin:      Tag === 'p' ? '0 0 0.75em' : 0,
        fontSize:    isCaption ? '0.75rem' : textSizes[size],
        fontWeight:  isCaption ? 500 : textWeights[weight],
        color:       textColors[variant],
        lineHeight:  1.65,
        fontFamily:  isCode ? '"SF Mono","Fira Code","Cascadia Code",monospace' : 'inherit',
        background:  isCode ? 'var(--weld-bg-elevated, #111115)' : undefined,
        border:      isCode ? '1px solid var(--weld-border, rgba(255,255,255,0.06))' : undefined,
        borderRadius: isCode ? '3px' : undefined,
        padding:     isCode ? '0.15em 0.4em' : undefined,
        display:     isCode ? 'inline' : undefined,
        letterSpacing: isCaption ? '0.04em' : undefined,
        textTransform: variant === 'label' ? 'uppercase' as const : undefined,
        whiteSpace:  truncate ? 'nowrap' as const : undefined,
        overflow:    truncate ? 'hidden' : undefined,
        textOverflow: truncate ? 'ellipsis' : undefined,
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}

// ─── Heading ──────────────────────────────────────────────────────────────────

export interface WeldHeadingProps {
  children?:  ReactNode
  level?:     1 | 2 | 3 | 4
  className?: string
  style?:     React.CSSProperties
}

const headingSizes = { 1: '1.6rem', 2: '1.15rem', 3: '0.875rem', 4: '0.8125rem' }
const headingWeights = { 1: 700, 2: 600, 3: 600, 4: 500 }
const headingTracking = { 1: '-0.03em', 2: '-0.015em', 3: '-0.01em', 4: '0' }

export function Heading({
  children,
  level = 2,
  className,
  style,
}: WeldHeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4'

  return (
    <Tag
      className={className}
      data-weld-heading
      style={{
        margin:        '0 0 0.4em',
        fontSize:      headingSizes[level],
        fontWeight:    headingWeights[level],
        letterSpacing: headingTracking[level],
        lineHeight:    1.25,
        color:         'var(--weld-text-primary, #f4f4f5)',
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}
