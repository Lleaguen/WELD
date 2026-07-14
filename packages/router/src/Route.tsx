import React, { useContext, useEffect, useRef, type ReactNode, type ComponentType } from 'react'
import { RouterContext } from './context.js'

export interface RouteProps {
  path:        string
  component?:  ComponentType<Record<string, unknown>>
  children?:   ReactNode
  /** Exact match only. Default: true */
  exact?:      boolean
}

function matchPath(pattern: string, pathname: string): { matched: boolean; params: Record<string, string> } {
  // Normalize: trim trailing slashes, ensure leading slash
  const norm = (s: string) => '/' + s.split('/').filter(Boolean).join('/')

  const normalPattern  = norm(pattern)
  const normalPathname = norm(pathname)

  // Root: exact match
  if (normalPattern === '/') {
    return { matched: normalPathname === '/', params: {} }
  }

  const patternParts  = normalPattern.split('/').filter(Boolean)
  const pathnameParts = normalPathname.split('/').filter(Boolean)

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

  return { matched: true, params }
}

export function Route({ path, component: Component, children }: RouteProps) {
  const ctx = useContext(RouterContext)

  // Always call hooks unconditionally — rules of hooks
  const paramsRef = useRef<Record<string, string>>({})

  const result = ctx ? matchPath(path, ctx.pathname) : { matched: false, params: {} }

  useEffect(() => {
    if (ctx && result.matched) {
      ctx.params = result.params
    }
  })

  if (!ctx || !result.matched) return null

  if (Component) return <Component {...result.params} />
  return <>{children}</>
}
