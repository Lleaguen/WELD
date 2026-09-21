/**
 * useProgressBar — GSAP smooth progress bar animation
 *
 * Animates the progress bar width smoothly instead of jumping.
 */
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useProgressBar(percent: number) {
  const barRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = barRef.current
    if (!el) return

    gsap.to(el, {
      width:    `${percent}%`,
      duration: 0.55,
      ease:     'power2.inOut',
    })
  }, [percent])

  // Set initial width without animation
  useEffect(() => {
    const el = barRef.current
    if (!el) return
    gsap.set(el, { width: `${percent}%` })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return barRef
}
