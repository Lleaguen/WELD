/**
 * @weldjs/react — Public API
 */

// Hook
export { useWeld }            from './useWeld.js'
export type { UseWeldResult } from './useWeld.js'

// Provider
export { WeldProvider }       from './provider/WeldProvider.js'
export type {
  WeldProviderProps,
  RouterAdapter,
  WeldBreakpoints,
  WeldThemeConfig,
} from './provider/WeldProvider.js'

// Primitive components
export { Button }  from './components/Button.js'
export { Input }   from './components/Input.js'
export type { WeldButtonProps } from './components/Button.js'
export type { WeldInputProps }  from './components/Input.js'

// Layout components
export { Shell }   from './layout/Shell.js'
export { Header }  from './layout/Header.js'
export { Sidebar } from './layout/Sidebar.js'
export { Main }    from './layout/Main.js'
export { Footer }  from './layout/Footer.js'
export type { WeldShellProps }   from './layout/Shell.js'
export type { WeldHeaderProps }  from './layout/Header.js'
export type { WeldSidebarProps } from './layout/Sidebar.js'
export type { WeldMainProps }    from './layout/Main.js'
export type { WeldFooterProps }  from './layout/Footer.js'

// Weld namespace — <Weld.Button />, <Weld.Shell />, etc.
import * as WeldComponents from './components/Weld.js'
export const Weld = WeldComponents

// Hooks
export { useResponsive } from './hooks/useResponsive.js'
export type { Breakpoint } from './hooks/useResponsive.js'

// Theme
export type { WeldTokens } from './theme/tokens.js'
