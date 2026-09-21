/**
 * useFloatAnimation — subtle GSAP float loop
 *
 * Makes an element gently float up and down indefinitely.
 * Used on the logo / hero elements.
 */
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useFloatAnimation(amplitude = 8, duration = 3) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const tween = gsap.to(el, {
      y:        amplitude,
      duration,
      ease:     'sine.inOut',
      repeat:   -1,
      yoyo:     true,
    })

    return () => { tween.kill() }
  }, [amplitude, duration])

  return ref
}
