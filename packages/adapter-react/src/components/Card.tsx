/**
 * @weldjs/react — <Weld.Card />
 *
 * Surface-elevated container. For grouping related content.
 * Optional header with title + actions, optional footer.
 *
 * 3D tilt (same API as `neon`):
 *   <Weld.Card tilt />                          // default — 8°, scale 1.02
 *   <Weld.Card tilt={{ max: 5, scale: 1.01 }} /> // custom
 *   <Weld.Card tilt={false} />                  // no tilt (default)
 *   <Weld.Card tilt="none" />                   // no tilt at all
 *
 * GSAP reveal on mount:
 *   <Weld.Card reveal />                              // default — fade up
 *   <Weld.Card reveal={{ y: 30, duration: 0.5 }} />   // custom
 *   <Weld.Card reveal={false} />                      // no reveal (default)
 *   <Weld.Card reveal="none" />                       // no reveal, no effect
 */

import React, { useRef, useEffect, useCallback, type ReactNode } from 'react'
import { useTilt3D, type TiltProp } from '../hooks/useTilt3D.js'
import type { RevealProp } from '../hooks/useGsapReveal.js'

export interface WeldCardProps {
  children?:  ReactNode
  title?:     string
  actions?:   ReactNode
  footer?:    ReactNode
  /** Neon left border accent */
  accent?:    boolean
  /**
   * 3D tilt on hover.
   * - true / object → tilt active (default: false)
   * - false         → no tilt
   * - 'none'        → no tilt, no will-change hint
   */
  tilt?:      TiltProp
  /**
   * GSAP entrance animation on mount. Requires gsap peer dependency.
   * - true / object → animate in (default: false)
   * - false / 'none' → no animation
   */
  reveal?:    RevealProp
  className?: string
  style?:     React.CSSProperties
  onClick?:   () => void
}

export function Card({
  children,
  title,
  actions,
  footer,
  accent    = false,
  tilt      = false,
  reveal    = false,
  className,
  style,
  onClick,
}: WeldCardProps) {
  const clickable = !!onClick
  const { ref: tiltRef, style: tiltStyle } = useTilt3D(tilt)
  const revealDone = useRef(false)

  // Merge tiltRef with local div ref for GSAP reveal
  const setRef = useCallback((el: HTMLDivElement | null) => {
    ;(tiltRef as React.MutableRefObject<HTMLElement | null>).current = el

    // GSAP reveal on first mount only
    if (!el || revealDone.current) return
    const noEffect = reveal === false || reveal === 'none'
    if (noEffect) return

    const reduced = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    revealDone.current = true

    const cfg = {
      y: 20, x: 0, scale: 0.97, duration: 0.45, delay: 0, ease: 'power3.out',
      ...(typeof reveal === 'object' && reveal !== null ? reveal : {}),
    }

    import('gsap').then(({ gsap }) => {
      gsap.fromTo(el,
        { opacity: 0, y: cfg.y, x: cfg.x, scale: cfg.scale },
        {
          opacity:    1,
          y:          0,
          x:          0,
          scale:      1,
          duration:   cfg.duration,
          delay:      cfg.delay,
          ease:       cfg.ease,
          clearProps: 'transform',
        }
      )
    }).catch(() => {})
  }, [tiltRef, reveal])

  return (
    <div
      ref={setRef}
      className={className}
      onClick={onClick}
      data-weld-card
      style={{
        background:   'var(--weld-bg-surface, #0d0d10)',
        border:       '1px solid var(--weld-border, rgba(255,255,255,0.06))',
        borderRadius: 'var(--weld-radius-lg, 8px)',
        borderLeft:   accent
          ? '2px solid var(--weld-plasma-cyan, #00d4ff)'
          : undefined,
        overflow:     'hidden',
        cursor:       clickable ? 'pointer' : undefined,
        transition:   clickable
          ? 'border-color 0.15s ease, background 0.15s ease'
          : undefined,
        ...(tilt && tilt !== 'none' ? tiltStyle : {}),
        ...style,
      }}
    >
      {/* Header */}
      {(title || actions) && (
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '14px 16px',
          borderBottom:   '1px solid var(--weld-border, rgba(255,255,255,0.06))',
          gap:            '12px',
        }}>
          {title && (
            <span style={{
              fontSize:      '0.8125rem',
              fontWeight:    600,
              color:         'var(--weld-text-primary, #f4f4f5)',
              letterSpacing: '-0.005em',
            }}>
              {title}
            </span>
          )}
          {actions && <div style={{ flexShrink: 0 }}>{actions}</div>}
        </div>
      )}

      {/* Body */}
      <div style={{ padding: '16px' }}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div style={{
          padding:    '12px 16px',
          borderTop:  '1px solid var(--weld-border, rgba(255,255,255,0.06))',
          background: 'rgba(255,255,255,0.01)',
        }}>
          {footer}
        </div>
      )}
    </div>
  )
}
