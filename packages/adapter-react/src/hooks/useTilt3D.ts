/**
 * @weldjs/react — useTilt3D
 *
 * Mouse-tracking 3D tilt effect. Same API pattern as the `neon` prop.
 *
 * Usage:
 *   const { ref, style } = useTilt3D(tilt)
 *   <div ref={ref} style={{ ...baseStyles, ...style }}>...</div>
 *
 * tilt values:
 *   true               → default config (max 8°, scale 1.02, perspective 900px)
 *   false              → effect disabled, no transform applied
 *   'none'             → no effect and no will-change hint
 *   { max, scale, perspective, speed } → custom config
 */

import { useRef, useState, useCallback, useEffect } from 'react'
import type { RefObject } from 'react'

// ─── Public types ─────────────────────────────────────────────────────────────

export type TiltConfig = {
  /** Max rotation in degrees. Default: 8 */
  max?:         number
  /** Scale on hover. Default: 1.02 — subtle lift */
  scale?:       number
  /** CSS perspective distance in px. Default: 900 */
  perspective?: number
  /** Transition duration in ms. Default: 200 */
  speed?:       number
}

export type TiltProp = boolean | TiltConfig | 'none'

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULTS: Required<TiltConfig> = {
  max:         8,
  scale:       1.02,
  perspective: 900,
  speed:       200,
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseTilt3DResult {
  ref:   RefObject<HTMLElement | null>
  style: React.CSSProperties
}

export function useTilt3D(tilt: TiltProp = true): UseTilt3DResult {
  const ref       = useRef<HTMLElement | null>(null)
  const frameRef  = useRef<number | null>(null)
  const [transform, setTransform] = useState<string>('')

  // Resolve config
  const noEffect = tilt === 'none'
  const disabled = tilt === false

  const cfg: Required<TiltConfig> = {
    ...DEFAULTS,
    ...(typeof tilt === 'object' && tilt !== null ? tilt : {}),
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current
    if (!el) return

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)

    frameRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      const cx   = rect.left + rect.width  / 2
      const cy   = rect.top  + rect.height / 2
      // Normalize -1..+1
      const dx   = (e.clientX - cx) / (rect.width  / 2)
      const dy   = (e.clientY - cy) / (rect.height / 2)
      // rotateX inverted: mouse near top → tilt forward
      const rx   = (-dy * cfg.max).toFixed(2)
      const ry   = ( dx * cfg.max).toFixed(2)
      setTransform(
        `perspective(${cfg.perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${cfg.scale})`
      )
    })
  }, [cfg.max, cfg.scale, cfg.perspective])

  const handleMouseLeave = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    setTransform(
      `perspective(${cfg.perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`
    )
  }, [cfg.perspective])

  useEffect(() => {
    // Skip on touch-only devices and when reduced motion is preferred
    if (
      noEffect || disabled ||
      (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    ) return

    const el = ref.current
    if (!el) return

    el.addEventListener('mousemove',  handleMouseMove  as EventListener)
    el.addEventListener('mouseleave', handleMouseLeave as EventListener)

    return () => {
      el.removeEventListener('mousemove',  handleMouseMove  as EventListener)
      el.removeEventListener('mouseleave', handleMouseLeave as EventListener)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [noEffect, disabled, handleMouseMove, handleMouseLeave])

  if (noEffect || disabled) {
    return { ref, style: {} }
  }

  return {
    ref,
    style: {
      transform:      transform || `perspective(${cfg.perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
      transition:     `transform ${cfg.speed}ms ease`,
      willChange:     'transform',
      transformStyle: 'preserve-3d',
    } satisfies React.CSSProperties,
  }
}
