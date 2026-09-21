/**
 * @weldjs/react — useGsapReveal
 *
 * Animates an element into view when it mounts using GSAP.
 * Designed for Cards, Sections, and any content block.
 *
 * Usage:
 *   const ref = useGsapReveal()
 *   <div ref={ref}>...</div>
 *
 *   // Custom config
 *   const ref = useGsapReveal({ y: 30, duration: 0.5, delay: 0.1 })
 *
 * RevealProp values:
 *   true               → default (y:20, opacity:0→1, duration:0.45, ease:power3.out)
 *   false / 'none'     → no animation
 *   { y, x, scale, duration, delay, ease } → custom
 */

import { useRef, useEffect } from 'react'
import type { RefObject }    from 'react'

export type RevealConfig = {
  /** Y offset to start from. Default: 20 */
  y?:        number
  /** X offset to start from. Default: 0 */
  x?:        number
  /** Scale to start from. Default: 0.97 */
  scale?:    number
  /** Duration in seconds. Default: 0.45 */
  duration?: number
  /** Delay in seconds. Default: 0 */
  delay?:    number
  /** GSAP ease string. Default: 'power3.out' */
  ease?:     string
}

export type RevealProp = boolean | RevealConfig | 'none'

const DEFAULTS: Required<RevealConfig> = {
  y:        20,
  x:        0,
  scale:    0.97,
  duration: 0.45,
  delay:    0,
  ease:     'power3.out',
}

export function useGsapReveal(reveal: RevealProp = true): RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const noEffect = reveal === 'none' || reveal === false
    if (noEffect) return

    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = ref.current
    if (!el) return

    const cfg: Required<RevealConfig> = {
      ...DEFAULTS,
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
    }).catch(() => {
      // gsap not installed — element stays visible (no opacity:0 flash)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}

/**
 * useGsapStagger — animates a list of children elements with a stagger
 *
 * Usage:
 *   const ref = useGsapStagger()
 *   <ul ref={ref}>
 *     <li>...</li>
 *     <li>...</li>
 *   </ul>
 */
export function useGsapStagger(
  stagger  = 0.07,
  config: Omit<RevealConfig, 'delay'> = {}
): RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = ref.current
    if (!el) return

    const children = Array.from(el.children)
    if (children.length === 0) return

    const cfg = { ...DEFAULTS, ...config }

    import('gsap').then(({ gsap }) => {
      gsap.fromTo(children,
        { opacity: 0, y: cfg.y, scale: cfg.scale },
        {
          opacity:    1,
          y:          0,
          scale:      1,
          duration:   cfg.duration,
          ease:       cfg.ease,
          stagger,
          clearProps: 'transform',
        }
      )
    }).catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}
