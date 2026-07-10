/**
 * @weldjs/react — useResponsive
 * Returns current breakpoint based on WeldProvider config.
 */

import { useState, useEffect } from 'react'
import { useWeldContext }       from '../provider/WeldProvider.js'

export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

export function useResponsive(): Breakpoint {
  const { breakpoints } = useWeldContext()

  const getBreakpoint = (): Breakpoint => {
    if (typeof window === 'undefined') return 'desktop'
    const w = window.innerWidth
    if (w < breakpoints.mobile)  return 'mobile'
    if (w < breakpoints.tablet)  return 'tablet'
    return 'desktop'
  }

  const [bp, setBp] = useState<Breakpoint>(getBreakpoint)

  useEffect(() => {
    const handler = () => setBp(getBreakpoint())
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [breakpoints])

  return bp
}
