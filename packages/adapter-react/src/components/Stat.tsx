/**
 * @weldjs/react — <Weld.Stat />
 *
 * Metric/KPI display. For dashboards and data summaries.
 *
 * Usage:
 *   <Weld.Stat label="Total Users" value="1,284" trend="+12%" trendUp />
 *   <Weld.Stat label="Latency" value="42ms" accent />
 */

import React from 'react'

export interface WeldStatProps {
  label:     string
  value:     string | number
  trend?:    string
  trendUp?:  boolean
  /** Highlight value with plasma color */
  accent?:   boolean
  style?:    React.CSSProperties
}

export function Stat({ label, value, trend, trendUp, accent = false, style }: WeldStatProps) {
  return (
    <div
      data-weld-stat
      style={{
        display:       'flex',
        flexDirection: 'column',
        gap:           '4px',
        ...style,
      }}
    >
      <span style={{
        fontSize:      '0.72rem',
        fontWeight:    500,
        color:         'var(--weld-text-muted, #52525b)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}>
        {label}
      </span>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{
          fontSize:      '1.6rem',
          fontWeight:    700,
          letterSpacing: '-0.03em',
          lineHeight:    1,
          color:         accent
            ? 'var(--weld-plasma-cyan, #00d4ff)'
            : 'var(--weld-text-primary, #f4f4f5)',
        }}>
          {value}
        </span>

        {trend && (
          <span style={{
            fontSize:   '0.75rem',
            fontWeight: 500,
            color:      trendUp ? '#22c55e' : '#ef4444',
          }}>
            {trend}
          </span>
        )}
      </div>
    </div>
  )
}
