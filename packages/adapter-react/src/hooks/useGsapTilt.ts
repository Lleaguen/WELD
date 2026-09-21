/**
 * @weldjs/react — useGsapTilt
 *
 * GSAP-powered tilt effect using gsap.quickTo() for physically smooth
 * interpolation — much better than rAF+setState because GSAP's ticker
 * handles easing between frames, eliminating jitter on fast mouse moves.
 *
 * Drop-in replacement for useTilt3D when gsap is available.
 * Same TiltProp API — boolean | TiltConfig | 'none'.
 *
 * Usage:
 *   const { ref } = useGsapTilt(tilt)
 *   <div ref={ref}>...</div>
 *
 * Requires gsap >= 3.12 as a peer dependency.
 */

import { useRef, useEffect } from 'react'
import type { RefObject }    from 'react'
import type { TiltProp, TiltConfig } from './useTilt3D.js'

export type { TiltProp, TiltConfig }

const DEFAULTS: Required<TiltConfig> = {
  max:         8,
  scale:       1.02,
  perspective: 900,
  speed:       200,
}

export interface UseGsapTiltResult {
  ref: RefObject<HTMLElement | null>
}

export function useGsapTilt(tilt: TiltProp = true): UseGsapTiltResult {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const noEffect = tilt === 'none'
    const disabled = tilt === false
    if (noEffect || disabled) return

    // Respect reduced motion
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = ref.current
    if (!el) return

    const cfg: Required<TiltConfig> = {
      ...DEFAULTS,
      ...(typeof tilt === 'object' && tilt !== null ? tilt : {}),
    }

    const speedSec = cfg.speed / 1000

    // Attempt to load gsap — gracefully skip if not installed
    let cleanup = () => {}

    import('gsap').then(({ gsap }) => {
      // gsap.quickTo returns a function that sets the target value
      // and GSAP interpolates smoothly between frames
      const setRotX  = gsap.quickTo(el, 'rotateX',  { duration: speedSec, ease: 'power3.out' })
      const setRotY  = gsap.quickTo(el, 'rotateY',  { duration: speedSec, ease: 'power3.out' })
      const setScale = gsap.quickTo(el, 'scale',     { duration: speedSec, ease: 'power3.out' })

      // Set perspective on the parent via CSS — GSAP handles the element transform
      el.style.transformStyle = 'preserve-3d'
      const parent = el.parentElement
      if (parent) parent.style.perspective = `${cfg.perspective}px`

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect()
        const cx   = rect.left + rect.width  / 2
        const cy   = rect.top  + rect.height / 2
        const dx   = (e.clientX - cx) / (rect.width  / 2)
        const dy   = (e.clientY - cy) / (rect.height / 2)

        setRotX(-dy * cfg.max)
        setRotY( dx * cfg.max)
        setScale(cfg.scale)
      }

      const onLeave = () => {
        setRotX(0)
        setRotY(0)
        setScale(1)
      }

      el.addEventListener('mousemove',  onMove)
      el.addEventListener('mouseleave', onLeave)

      cleanup = () => {
        el.removeEventListener('mousemove',  onMove)
        el.removeEventListener('mouseleave', onLeave)
        gsap.killTweensOf(el)
        gsap.set(el, { rotateX: 0, rotateY: 0, scale: 1, clearProps: 'transform' })
        el.style.transformStyle = ''
        if (parent) parent.style.perspective = ''
      }
    }).catch(() => {
      // gsap not installed — silently skip
    })

    return () => cleanup()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { ref }
}
