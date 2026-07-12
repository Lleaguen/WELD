import React, { useContext, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { RouterContext } from './context.js'

export interface WeldLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to:        string
  children:  ReactNode
  replace?:  boolean
  /** Style applied when the link matches the current path */
  activeStyle?: React.CSSProperties
  activeClassName?: string
}

export function Link({
  to,
  children,
  replace = false,
  activeStyle,
  activeClassName,
  style,
  className,
  onClick,
  ...rest
}: WeldLinkProps) {
  const ctx = useContext(RouterContext)

  const isActive = ctx?.pathname === to

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    onClick?.(e)
    ctx?.navigate(to, { replace })
  }

  return (
    <a
      href={to}
      onClick={handleClick}
      style={{ ...style, ...(isActive ? activeStyle : {}) }}
      className={[className, isActive ? activeClassName : ''].filter(Boolean).join(' ') || undefined}
      {...rest}
    >
      {children}
    </a>
  )
}
