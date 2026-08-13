import React, { useState } from 'react'
import { Weld } from '@weldjs/react'
import { Step1 } from './pages/Step1'
import { Step2 } from './pages/Step2'
import { Step3 } from './pages/Step3'
import { Step4 } from './pages/Step4'
import { Step5 } from './pages/Step5'
import { Step6 } from './pages/Step6'
import { Step7 } from './pages/Step7'

const STEPS = [
  {
    key:         'step1',
    label:       'Instalación',
    emoji:       '⚙️',
    description: 'Qué es WELD y cómo configurarlo',
    component:   Step1,
  },
  {
    key:         'step2',
    label:       'Componentes',
    emoji:       '🧱',
    description: 'Button, Input, Stack, Grid y más',
    component:   Step2,
  },
  {
    key:         'step3',
    label:       'HTTP Client',
    emoji:       '🌐',
    description: 'El pipeline de 4 capas',
    component:   Step3,
  },
  {
    key:         'step4',
    label:       'Overlays',
    emoji:       '💬',
    description: 'Modal, Toast, Tooltip, Alert',
    component:   Step4,
  },
  {
    key:         'step5',
    label:       'Datos',
    emoji:       '📊',
    description: 'Table, Stat, Tabs, Grid',
    component:   Step5,
  },
  {
    key:         'step6',
    label:       'Formularios',
    emoji:       '📝',
    description: 'useForm con validación Zod',
    component:   Step6,
  },
  {
    key:         'step7',
    label:       'Tilt & Neon',
    emoji:       '✨',
    description: 'Efectos visuales opcionales',
    component:   Step7,
  },
]

export function App() {
  const [activeStep, setActiveStep] = useState('step1')

  const currentIndex    = STEPS.findIndex(s => s.key === activeStep)
  const current         = STEPS[currentIndex]!
  const StepComponent   = current.component
  const progressPercent = ((currentIndex + 1) / STEPS.length) * 100

  const goNext = () => { const n = STEPS[currentIndex + 1]; if (n) setActiveStep(n.key) }
  const goPrev = () => { const p = STEPS[currentIndex - 1]; if (p) setActiveStep(p.key) }

  return (
    <Weld.Shell>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <Weld.Header fixed neon>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28,
            background: 'linear-gradient(135deg, #00d4ff, #3b6bff)',
            borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 800, color: '#000', flexShrink: 0,
          }}>W</div>
          <Weld.Text style={{
            fontWeight: 700, fontSize: 15,
            background: 'linear-gradient(135deg, #00d4ff, #7c9fff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            WELD Tutorial
          </Weld.Text>
        </div>

        {/* Barra de progreso en el header */}
        <div style={{ flex: 1, margin: '0 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #00d4ff, #3b6bff)',
              borderRadius: 2,
              transition: 'width 0.4s ease',
              boxShadow: '0 0 8px rgba(0,212,255,0.4)',
            }} />
          </div>
          <Weld.Text variant="muted" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>
            {currentIndex + 1} / {STEPS.length}
          </Weld.Text>
        </div>

        <Weld.Badge style={{ fontSize: 11 }}>
          {current.emoji} {current.label}
        </Weld.Badge>
      </Weld.Header>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1 }}>

        {/* Sidebar */}
        <Weld.Sidebar>
          <div style={{ padding: '20px 0 12px' }}>
            <Weld.Text variant="muted" style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '0 16px', marginBottom: 10,
            }}>
              Pasos del tutorial
            </Weld.Text>

            <Weld.Stack gap={1}>
              {STEPS.map((step, i) => {
                const isActive    = step.key === activeStep
                const isCompleted = i < currentIndex
                return (
                  <button
                    key={step.key}
                    onClick={() => setActiveStep(step.key)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      padding: '9px 16px',
                      background:   isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                      border:       'none',
                      borderLeft:   isActive ? '2px solid #00d4ff' : '2px solid transparent',
                      cursor:       'pointer',
                      width:        '100%',
                      textAlign:    'left',
                      transition:   'all 0.12s',
                    }}
                  >
                    <span style={{
                      fontSize: 14, lineHeight: 1, marginTop: 2, flexShrink: 0,
                      filter: !isActive && !isCompleted ? 'grayscale(100%) opacity(0.4)' : undefined,
                    }}>
                      {isCompleted ? '✓' : step.emoji}
                    </span>
                    <div>
                      <div style={{
                        fontSize:   13,
                        fontWeight: isActive ? 600 : 400,
                        color:      isActive ? '#00d4ff' : isCompleted ? '#52525b' : '#71717a',
                        lineHeight: 1.3,
                      }}>
                        {step.label}
                      </div>
                      <div style={{
                        fontSize: 11, color: '#3f3f46', marginTop: 2, lineHeight: 1.3,
                        display: isActive ? 'block' : 'none',
                      }}>
                        {step.description}
                      </div>
                    </div>
                  </button>
                )
              })}
            </Weld.Stack>
          </div>
        </Weld.Sidebar>

        {/* Main */}
        <Weld.Main>
          <Weld.Container style={{ maxWidth: 860, padding: '36px 28px 60px' }}>

            {/* Título del paso */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 24 }}>{current.emoji}</span>
                <Weld.Heading level={1} style={{ margin: 0 }}>
                  {current.label}
                </Weld.Heading>
              </div>
              <Weld.Text variant="muted">{current.description}</Weld.Text>
            </div>

            {/* Contenido del paso */}
            <StepComponent />

            <Weld.Divider style={{ margin: '44px 0 32px' }} />

            {/* Navegación */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                {currentIndex > 0 && (
                  <Weld.Button
                    variant="ghost"
                    action={() => { goPrev(); window.scrollTo(0, 0); return Promise.resolve() }}
                  >
                    ← {STEPS[currentIndex - 1]?.label}
                  </Weld.Button>
                )}
              </div>
              <div>
                {currentIndex < STEPS.length - 1 ? (
                  <Weld.Button
                    variant="primary"
                    action={() => { goNext(); window.scrollTo(0, 0); return Promise.resolve() }}
                  >
                    Siguiente: {STEPS[currentIndex + 1]?.label} →
                  </Weld.Button>
                ) : (
                  <Weld.Card tilt accent style={{ padding: '20px 24px', textAlign: 'center' }}>
                    <Weld.Stack gap={12} style={{ alignItems: 'center' }}>
                      <div style={{ fontSize: 32 }}>🎉</div>
                      <Weld.Heading level={3} style={{ margin: 0 }}>¡Completaste el tutorial!</Weld.Heading>
                      <Weld.Text variant="muted" style={{ fontSize: 13, maxWidth: 400 }}>
                        Ya sabés usar WELD desde cero. El siguiente paso es construir algo real.
                      </Weld.Text>
                      <Weld.Stack direction="row" gap={10}>
                        <Weld.Button
                          variant="primary"
                          action={() => { window.open('https://weld-docs.vercel.app', '_blank'); return Promise.resolve() }}
                        >
                          Ver documentación completa
                        </Weld.Button>
                        <Weld.Button
                          variant="secondary"
                          action={() => { setActiveStep('step1'); window.scrollTo(0, 0); return Promise.resolve() }}
                        >
                          Volver al inicio
                        </Weld.Button>
                      </Weld.Stack>
                    </Weld.Stack>
                  </Weld.Card>
                )}
              </div>
            </div>

          </Weld.Container>
        </Weld.Main>
      </div>

      {/* Footer */}
      <Weld.Footer>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 24px' }}>
          <Weld.Text variant="muted" style={{ fontSize: 11 }}>
            Construido con <Weld.Text variant="code" as="span" style={{ fontSize: 11 }}>@weldjs/react</Weld.Text> — el tutorial usa solo WELD
          </Weld.Text>
          <Weld.Text variant="muted" style={{ fontSize: 11 }}>
            {Math.round(progressPercent)}% completado
          </Weld.Text>
        </div>
      </Weld.Footer>

    </Weld.Shell>
  )
}
