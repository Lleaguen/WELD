import React, { useState } from 'react'
import { Weld, toast } from '@weldjs/react'

export function Step1() {
  // Ejercicio 1: el usuario escribe su nombre para "configurar" su entorno
  const [devName, setDevName] = useState('')
  const [ready, setReady] = useState(false)

  const handleReady = async () => {
    if (devName.trim().length < 2) throw new Error('Necesitás un nombre')
    await new Promise(r => setTimeout(r, 600))
    setReady(true)
    toast({ message: `¡Bienvenido ${devName}! Tu entorno WELD está listo.`, variant: 'success' })
  }

  return (
    <Weld.Stack gap={32}>

      {/* ── Concepto ──────────────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>¿Qué es WELD?</Weld.Badge>
        <Weld.Heading level={2}>Tu app conectada a la red, sin boilerplate</Weld.Heading>
        <Weld.Text>
          Cada vez que hacés una app React que necesita datos de un servidor,
          terminás escribiendo lo mismo: <Weld.Text variant="code" as="span">useState(null)</Weld.Text>,{' '}
          <Weld.Text variant="code" as="span">useState(false)</Weld.Text>,{' '}
          <Weld.Text variant="code" as="span">useState(null)</Weld.Text> para data, loading y error.
          Luego un <Weld.Text variant="code" as="span">useEffect</Weld.Text> con fetch, catch, finally.
          Y eso es solo para un request.
        </Weld.Text>
        <Weld.Text>
          <strong style={{ color: '#f4f4f5' }}>WELD elimina ese ciclo.</strong>{' '}
          Define el contrato entre tu backend y tu frontend una sola vez, y el resto — loading,
          errores, cache offline, validación, deduplicación — sucede automáticamente.
        </Weld.Text>
      </Weld.Stack>

      <Weld.Divider />

      {/* ── El problema ───────────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>El problema</Weld.Badge>
        <Weld.Grid cols={2} gap={16}>
          <Weld.Card title="Código sin WELD" style={{ borderLeft: '2px solid rgba(239,68,68,0.35)' }}>
            <Weld.Text variant="muted" style={{ fontSize: 12, marginBottom: 10 }}>
              15+ líneas para algo básico. Fácil de olvidar el catch. Sin cache. Sin types.
            </Weld.Text>
            <Weld.Text variant="code" as="pre" style={{ fontSize: 11, lineHeight: 1.65 }}>{`const [data,    setData]    = useState(null)
const [loading, setLoading] = useState(false)
const [error,   setError]   = useState(null)

useEffect(() => {
  setLoading(true)
  fetch('https://api.ejemplo.com/products')
    .then(res => {
      if (!res.ok) throw new Error('HTTP error')
      return res.json()
    })
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false))
}, [])

if (loading) return <Spinner />
if (error)   return <p>{error.message}</p>
return <List data={data} />`}</Weld.Text>
          </Weld.Card>

          <Weld.Card title="Código con WELD" accent>
            <Weld.Text variant="muted" style={{ fontSize: 12, marginBottom: 10 }}>
              3 líneas. Tipado E2E. Cache offline incluido. Validación Zod en el boundary.
            </Weld.Text>
            <Weld.Text variant="code" as="pre" style={{ fontSize: 11, lineHeight: 1.65 }}>{`const api = new Weld<AppRouter>(
  'https://api.ejemplo.com'
)

// En tu componente:
const { data, loading, error } = useWeld(
  api.get('products', ProductArraySchema)
)

if (loading) return <Weld.Spinner />
if (error)   return <Weld.Alert>{error.message}</Weld.Alert>
return <List data={data} />`}</Weld.Text>
          </Weld.Card>
        </Weld.Grid>
      </Weld.Stack>

      <Weld.Divider />

      {/* ── Setup ─────────────────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>Setup</Weld.Badge>
        <Weld.Heading level={3}>Instalación en 2 pasos</Weld.Heading>

        <Weld.Stack gap={10}>
          <Weld.Text style={{ fontWeight: 600, color: '#f4f4f5' }}>1. Instalá los paquetes</Weld.Text>
          <Weld.Card accent>
            <Weld.Text variant="code" as="pre">{`npm install @weldjs/react zod`}</Weld.Text>
          </Weld.Card>
          <Weld.Text variant="muted" style={{ fontSize: 13 }}>
            <Weld.Text variant="code" as="span">zod</Weld.Text> es obligatorio — WELD lo usa para validar
            las respuestas del servidor en runtime, antes de que toquen tu UI.
          </Weld.Text>
        </Weld.Stack>

        <Weld.Stack gap={10}>
          <Weld.Text style={{ fontWeight: 600, color: '#f4f4f5' }}>2. Envolvé tu app con WeldProvider</Weld.Text>
          <Weld.Card accent>
            <Weld.Text variant="code" as="pre">{`// src/main.tsx
import { WeldProvider } from '@weldjs/react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <WeldProvider>
    <App />
  </WeldProvider>
)`}</Weld.Text>
          </Weld.Card>
          <Weld.Text variant="muted" style={{ fontSize: 13 }}>
            <Weld.Text variant="code" as="span">WeldProvider</Weld.Text> inyecta los tokens de diseño
            (colores, radios, tipografía) y el contexto global. <strong style={{ color: '#f4f4f5' }}>Sin él,
            ningún componente funciona.</strong>
          </Weld.Text>
        </Weld.Stack>

        <Weld.Alert variant="info">
          ¿Querés scaffoldear un proyecto completo? Usá <Weld.Text variant="code" as="span">npm create weld-app@latest mi-app</Weld.Text> y
          tenés React + Vite + WELD configurados en segundos.
        </Weld.Alert>
      </Weld.Stack>

      <Weld.Divider />

      {/* ── Ejercicio ─────────────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content', background: 'rgba(59,107,255,0.15)', color: '#7c9fff' }}>
          Ejercicio 1
        </Weld.Badge>
        <Weld.Heading level={3}>Configurá tu entorno</Weld.Heading>
        <Weld.Text>
          Este tutorial es interactivo — cada ejercicio te pide que hagas algo.
          Para empezar, escribí tu nombre. Así el tutorial sabe que entendiste el setup.
        </Weld.Text>

        {!ready ? (
          <Weld.Card>
            <Weld.Stack gap={14}>
              <Weld.Input
                label="¿Cómo te llamás?"
                placeholder="Tu nombre o alias"
                value={devName}
                onChange={setDevName}
                error={devName.length > 0 && devName.trim().length < 2 ? 'Mínimo 2 caracteres' : undefined}
              />
              <Weld.Text variant="muted" style={{ fontSize: 13 }}>
                Cuando hagas click en el botón, vas a ver el ciclo completo de un botón WELD:
                idle → loading → success. Sin ningún código extra de tu parte.
              </Weld.Text>
              <Weld.Button action={handleReady} disabled={devName.trim().length < 2}>
                Iniciar entorno WELD
              </Weld.Button>
            </Weld.Stack>
          </Weld.Card>
        ) : (
          <Weld.Alert variant="success">
            ✓ Entorno configurado para <strong>{devName}</strong>. ¡Pasemos al siguiente paso!
          </Weld.Alert>
        )}
      </Weld.Stack>

    </Weld.Stack>
  )
}
