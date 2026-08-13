/**
 * @weldjs/react — <Weld.Modal />
 *
 * Overlay dialog. Blocks interaction with the rest of the page.
 * Closes on backdrop click or Escape key.
 *
 * 3D tilt:
 *   <Weld.Modal tilt />                          // entrance + subtle float tilt
 *   <Weld.Modal tilt={{ max: 3, scale: 1.01 }} /> // custom
 *   <Weld.Modal tilt={false} />                  // no tilt (default)
 *   <Weld.Modal tilt="none" />                   // no tilt, no will-change
 *
 * Usage:
 *   <Weld.Modal open={open} onClose={() => setOpen(false)} title="Confirm delete">
 *     <p>This action cannot be undone.</p>
 *     <Weld.Stack direction="row" justify="flex-end" gap={8}>
 *       <Weld.Button variant="ghost" action={() => { setOpen(false); return Promise.resolve() }}>Cancel</Weld.Button>
 *       <Weld.Button variant="danger" action={handleDelete}>Delete</Weld.Button>
 *     </Weld.Stack>
 *   </Weld.Modal>
 */

import React, { useEffect, type ReactNode } from 'react'
import { useTilt3D, type TiltProp } from '../hooks/useTilt3D.js'

export interface WeldModalProps {
  open:       boolean
  onClose:    () => void
  title?:     string
  children?:  ReactNode
  /** Max width of the dialog. Default: 480 */
  width?:     number
  /** Hide the close button */
  hideClose?: boolean
  /**
   * 3D tilt — the dialog floats and responds to mouse movement.
   * - true / object → tilt active (default: false)
   * - false         → no tilt
   * - 'none'        → no tilt, no will-change hint
   */
  tilt?:      TiltProp
  style?:     React.CSSProperties
}

if (typeof document !== 'undefined') {
  const id = '__weld_modal__'
  if (!document.getElementById(id)) {
    const s = document.createElement('style')
    s.id = id
    s.textContent = `
      @keyframes _weld-modal-in {
        from { opacity: 0; transform: translateY(10px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0)    scale(1); }
      }
      @keyframes _weld-modal-in-3d {
        from { opacity: 0; transform: perspective(900px) rotateX(4deg) translateY(12px) scale(0.97); }
        to   { opacity: 1; transform: perspective(900px) rotateX(0deg) translateY(0)    scale(1); }
      }
      @keyframes _weld-backdrop-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
    `
    document.head.appendChild(s)
  }
}

export function Modal({
  open,
  onClose,
  title,
  children,
  width     = 480,
  hideClose = false,
  tilt      = false,
  style,
}: WeldModalProps) {
  const tiltActive = tilt && tilt !== 'none'

  // Modal tilt uses conservative values — it's a large element
  const { ref, style: tiltStyle } = useTilt3D(
    tiltActive
      ? (tilt === true
          ? { max: 4, scale: 1.01, perspective: 1000, speed: 250 }
          : tilt)
      : 'none'
  )

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else      document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      data-weld-modal-backdrop
      onClick={onClose}
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         1000,
        background:     'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '16px',
        animation:      '_weld-backdrop-in 0.18s ease',
      }}
    >
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        data-weld-modal
        onClick={(e) => e.stopPropagation()}
        style={{
          width:        '100%',
          maxWidth:     `${width}px`,
          background:   'var(--weld-bg-elevated, #111115)',
          border:       '1px solid rgba(255,255,255,0.08)',
          borderRadius: 'var(--weld-radius-xl, 12px)',
          overflow:     'hidden',
          // 3D entrance animation when tilt is active, flat otherwise
          animation:    tiltActive
            ? '_weld-modal-in-3d 0.25s cubic-bezier(0.16,1,0.3,1)'
            : '_weld-modal-in 0.2s cubic-bezier(0.16,1,0.3,1)',
          // Apply tilt hover styles on top of animation
          ...(tiltActive ? tiltStyle : {}),
          ...style,
        }}
      >
        {/* Header */}
        {(title || !hideClose) && (
          <div style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            padding:        '16px 20px',
            borderBottom:   '1px solid var(--weld-border, rgba(255,255,255,0.06))',
          }}>
            {title && (
              <span style={{
                fontSize:      '0.9375rem',
                fontWeight:    600,
                color:         'var(--weld-text-primary, #f4f4f5)',
                letterSpacing: '-0.01em',
              }}>
                {title}
              </span>
            )}
            {!hideClose && (
              <button
                onClick={onClose}
                style={{
                  background:   'transparent',
                  border:       'none',
                  cursor:       'pointer',
                  color:        'var(--weld-text-muted, #52525b)',
                  padding:      '4px',
                  borderRadius: '4px',
                  display:      'flex',
                  alignItems:   'center',
                  marginLeft:   'auto',
                  transition:   'color 0.15s',
                }}
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div style={{ padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
