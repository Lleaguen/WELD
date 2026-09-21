/**
 * usePageEnter — GSAP animation on step change
 *
 * Animates the page content in whenever `key` changes.
 * Elements with data-animate are staggered in.
 */
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function usePageEnter(key: string) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Kill any running tweens on this container to avoid conflicts
    gsap.killTweensOf(el.querySelectorAll('[data-animate]'))

    // Slide + fade in the whole container first
    gsap.fromTo(el,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.38, ease: 'power3.out', clearProps: 'transform' }
    )

    // Stagger children with data-animate attribute
    const children = el.querySelectorAll('[data-animate]')
    if (children.length > 0) {
      gsap.fromTo(children,
        { opacity: 0, y: 22, scale: 0.97 },
        {
          opacity:  1,
          y:        0,
          scale:    1,
          duration: 0.4,
          ease:     'power2.out',
          stagger:  0.06,
          delay:    0.1,
          clearProps: 'transform,scale',
        }
      )
    }
  }, [key])

  return containerRef
}
