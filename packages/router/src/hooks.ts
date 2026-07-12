import { useContext } from 'react'
import { RouterContext } from './context.js'

export function useNavigate() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('[WeldRouter] useNavigate must be used inside <WeldRouter>')
  return ctx.navigate
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('[WeldRouter] useParams must be used inside <WeldRouter>')
  return ctx.params as T
}

export function useLocation() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('[WeldRouter] useLocation must be used inside <WeldRouter>')
  return { pathname: ctx.pathname, search: ctx.search, hash: ctx.hash }
}

export function useSearchParams(): URLSearchParams {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('[WeldRouter] useSearchParams must be used inside <WeldRouter>')
  return new URLSearchParams(ctx.search)
}
