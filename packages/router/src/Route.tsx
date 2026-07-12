import React, { useContext, useEffect, type ReactNode, type ComponentType } from 'react'
import { RouterContext } from './context.js'

export interface RouteProps {
  path:        string
  component?:  ComponentType<Record<string, unknown>>
  children?:   ReactNode
  /** Exact match only. Default: true */
  exact?:      boolean
}

function matchPath(pattern: string, pathname: string): { matched: boolean; params: Record<string, string> } {
  const patternParts  = pattern.split('/').filter(Boolean)
  const pathnameParts = pathname.split('/').filter(Boolean)

  if (patternParts.length !== pathnameParts.length) {
    return { matched: false, params: {} }
  }

  const params: Record<string, string> = {}

  for (let i = 0; i < patternParts.length; i++) {
    const pp = patternParts[i]!
    const lp = pathnameParts[i]!
    if (pp.startsWith(':')) {
      params[pp.slice(1)] = decodeURIComponent(lp)
    } else if (pp !== lp) {
      return { matched: false, params: {} }
    }
  }

  // Handle root
  if (pattern === '/' && pathname !== '/') return { matched: false, params: {} }

  return { matched: true, params }
}

export function Route({ path, component: Component, children, exact = true }: RouteProps) {
  const ctx = useContext(RouterContext)
  if (!ctx) return null

  const { matched, params } = matchPath(path, ctx.pathname)
  if (!matched) return null

  // Inject params into context — we mutate the shared ref
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    ctx.params = params
  })

  if (Component) return <Component {...params} />
  return <>{children}</>
}
