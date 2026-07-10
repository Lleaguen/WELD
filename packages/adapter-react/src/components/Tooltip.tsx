/**
 * @weldjs/react — <Weld.Tooltip />
 *
 * Simple hover tooltip. Wraps any element.
 *
 * Usage:
 *   <Weld.Tooltip content="Delete this item">
 *     <Weld.Button variant="danger" size="sm">✕</Weld.Button>
 *   </Weld.Tooltip>
 */

import React, { useState, useRef, type ReactNode } from 'react'

export interface WeldTooltipProps {
  content:    string | ReactNode
  children:   ReactNode
  position?:  'top' | 'bottom' | 'left' | 'right'
  delay?:     number
}

if (typeof document !== 'undefined') {
  const id = '__weld_tooltip__'
  if (!document.getElementById(id)) {
    const s = document.createElement('style')
    s.id = id
    s.textContent = `
      @keyframes _weld-tooltip-in {
        from { opacity: 0; transform: translateY(3px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `
    document.head.appendChild(s)
  }
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 400,
}: WeldTooltipProps) {
  const [visible, setVisible] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    timer.current = setTimeout(() => setVisible(true), delay)
  }

  const hide = () => {
    if (timer.current) clearTimeout(timer.current)
    setVisible(false)
  }

  const posStyles: Record<string, React.CSSProperties> = {
    top:    { bottom: 'calc(100% + 7px)', left: '50%', transform: 'translateX(-50%)' },
    bottom: { top:    'calc(100% + 7px)', left: '50%', transform: 'translateX(-50%)' },
    left:   { right:  'calc(100% + 7px)', top:  '50%', transform: 'translateY(-50%)' },
    right:  { left:   'calc(100% + 7px)', top:  '50%', transform: 'translateY(-50%)' },
  }

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      {visible && (
        <div
          role="tooltip"
          data-weld-tooltip
          style={{
            position:     'absolute',
            ...posStyles[position],
            zIndex:       500,
            padding:      '5px 9px',
            fontSize:     '0.75rem',
            fontWeight:   500,
            lineHeight:   1.4,
            color:        'var(--weld-text-primary, #f4f4f5)',
            background:   'var(--weld-bg-elevated, #111115)',
            border:       '1px solid rgba(255,255,255,0.10)',
            borderRadius: 'var(--weld-radius, 5px)',
            boxShadow:    '0 4px 16px rgba(0,0,0,0.4)',
            whiteSpace:   'nowrap',
            pointerEvents: 'none',
            animation:    '_weld-tooltip-in 0.12s ease',
          }}
        >
          {content}
        </div>
      )}
    </div>
  )
}
