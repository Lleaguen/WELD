/**
 * Injects Weld CSS tokens into a DOM element (default: :root).
 */

import { defaultTokens, type WeldTokens } from './tokens.js'

export function injectTokens(overrides?: WeldTokens, target: HTMLElement = document.documentElement): void {
  const tokens = { ...defaultTokens, ...overrides }
  for (const [key, value] of Object.entries(tokens)) {
    target.style.setProperty(key, value)
  }
}
