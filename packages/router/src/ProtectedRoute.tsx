import React, { type ReactNode, type ComponentType } from 'react'
import { Redirect } from './Redirect.js'

export interface ProtectedRouteProps {
  /** If false, redirects to `redirectTo` */
  isAllowed:    boolean
  redirectTo?:  string
  component?:   ComponentType<Record<string, unknown>>
  children?:    ReactNode
}

export function ProtectedRoute({
  isAllowed,
  redirectTo = '/login',
  component: Component,
  children,
}: ProtectedRouteProps) {
  if (!isAllowed) return <Redirect to={redirectTo} />
  if (Component) return <Component />
  return <>{children}</>
}
