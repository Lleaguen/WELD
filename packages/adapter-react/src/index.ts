/**
 * @weldjs/react — Public API
 */

// ── Core hook ──────────────────────────────────────────────────────────────────
export { useWeld }            from './useWeld.js'
export type { UseWeldResult } from './useWeld.js'

// ── Provider ───────────────────────────────────────────────────────────────────
export { WeldProvider }       from './provider/WeldProvider.js'
export type {
  WeldProviderProps,
  RouterAdapter,
  WeldBreakpoints,
  WeldThemeConfig,
} from './provider/WeldProvider.js'

// ── Primitive components ───────────────────────────────────────────────────────
export { Button }  from './components/Button.js'
export { Input }   from './components/Input.js'
export type { WeldButtonProps } from './components/Button.js'
export type { WeldInputProps }  from './components/Input.js'

// ── Layout ─────────────────────────────────────────────────────────────────────
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

// ── Structure ──────────────────────────────────────────────────────────────────
export { Section }   from './components/Section.js'
export { Card }      from './components/Card.js'
export { Stack }     from './components/Stack.js'
export { Grid }      from './components/Grid.js'
export { Divider }   from './components/Divider.js'
export { Container } from './components/Container.js'
export type { WeldSectionProps }   from './components/Section.js'
export type { WeldCardProps }      from './components/Card.js'
export type { WeldStackProps }     from './components/Stack.js'
export type { WeldGridProps }      from './components/Grid.js'
export type { WeldDividerProps }   from './components/Divider.js'
export type { WeldContainerProps } from './components/Container.js'

// ── Typography ─────────────────────────────────────────────────────────────────
export { Text, Heading } from './components/Text.js'
export { Badge }         from './components/Badge.js'
export type { WeldTextProps, WeldHeadingProps } from './components/Text.js'
export type { WeldBadgeProps }                  from './components/Badge.js'

// ── Feedback ───────────────────────────────────────────────────────────────────
export { Alert }             from './components/Alert.js'
export { Spinner, Skeleton } from './components/Spinner.js'
export { Empty }             from './components/Empty.js'
export { toast, ToastProvider } from './components/Toast.js'
export type { WeldAlertProps }                     from './components/Alert.js'
export type { WeldSpinnerProps, WeldSkeletonProps } from './components/Spinner.js'
export type { WeldEmptyProps }                     from './components/Empty.js'
export type { WeldToastProviderProps, ToastItem }  from './components/Toast.js'

// ── Overlay & interaction ──────────────────────────────────────────────────────
export { Modal }    from './components/Modal.js'
export { Tooltip }  from './components/Tooltip.js'
export { Dropdown } from './components/Dropdown.js'
export type { WeldModalProps }    from './components/Modal.js'
export type { WeldTooltipProps }  from './components/Tooltip.js'
export type { WeldDropdownProps, WeldDropdownItem } from './components/Dropdown.js'

// ── Navigation ─────────────────────────────────────────────────────────────────
export { Breadcrumb } from './components/Breadcrumb.js'
export { Avatar }     from './components/Avatar.js'
export type { WeldBreadcrumbProps, WeldBreadcrumbItem } from './components/Breadcrumb.js'
export type { WeldAvatarProps }                         from './components/Avatar.js'

// ── Data display ───────────────────────────────────────────────────────────────
export { Table } from './components/Table.js'
export { Stat }  from './components/Stat.js'
export { Tabs }  from './components/Tabs.js'
export type { WeldTableProps, WeldTableColumn } from './components/Table.js'
export type { WeldStatProps }                   from './components/Stat.js'
export type { WeldTabsProps, WeldTabItem }      from './components/Tabs.js'

// ── Hooks ──────────────────────────────────────────────────────────────────────
export { useResponsive } from './hooks/useResponsive.js'
export type { Breakpoint } from './hooks/useResponsive.js'

// ── Theme ──────────────────────────────────────────────────────────────────────
export type { WeldTokens } from './theme/tokens.js'

// ── Weld namespace — <Weld.Button />, <Weld.Card />, etc. ─────────────────────
import * as WeldComponents from './components/Weld.js'
export const Weld = WeldComponents
