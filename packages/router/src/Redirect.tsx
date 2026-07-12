import { useEffect } from 'react'
import { useNavigate } from './hooks.js'

export interface RedirectProps {
  to:       string
  replace?: boolean
}

export function Redirect({ to, replace = true }: RedirectProps) {
  const navigate = useNavigate()
  useEffect(() => { navigate(to, { replace }) }, [to, replace, navigate])
  return null
}
