import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export interface RouteParams {
  [key: string]: string
}

export interface RouterContextValue {
  pathname:   string
  search:     string
  hash:       string
  params:     RouteParams
  navigate:   (to: string, options?: { replace?: boolean; state?: unknown }) => void
  back:       () => void
  forward:    () => void
}

export const RouterContext = createContext<RouterContextValue | null>(null)

export function useRouter(): RouterContextValue {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('[WeldRouter] Hooks must be used inside <WeldRouter>')
  return ctx
}

export interface WeldRouterProps {
  children: ReactNode
  base?:    string
}

export function WeldRouter({ children, base = '' }: WeldRouterProps) {
  const getLocation = () => ({
    pathname: window.location.pathname.replace(base, '') || '/',
    search:   window.location.search,
    hash:     window.location.hash,
  })

  const [location, setLocation] = useState(getLocation)
  const [params, setParams]     = useState<RouteParams>({})

  useEffect(() => {
    const handler = () => setLocation(getLocation())
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [base])

  const navigate = useCallback((to: string, options?: { replace?: boolean; state?: unknown }) => {
    const url = base + to
    if (options?.replace) {
      window.history.replaceState(options.state ?? null, '', url)
    } else {
      window.history.pushState(options?.state ?? null, '', url)
    }
    setLocation(getLocation())
  }, [base])

  const back    = useCallback(() => window.history.back(), [])
  const forward = useCallback(() => window.history.forward(), [])

  return (
    <RouterContext.Provider value={{ ...location, params, navigate, back, forward }}>
      {children}
    </RouterContext.Provider>
  )
}
