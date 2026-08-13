import React, { useState } from 'react'
import { Weld, toast } from '@weldjs/react'

type IpData = { origin: string; url: string }

export function Step3() {
  const [stepA,  setStepA]  = useState(false)
  const [stepB,  setStepB]  = useState(false)
  const [stepC,  setStepC]  = useState(false)
  const [ipData, setIpData] = useState<IpData | null>(null)
  const [bCount, setBCount] = useState(0)

  async function doFetchA() {
    const res  = await fetch('https://httpbin.org/get')
    const json = await res.json() as IpData
    setIpData(json)
    setStepA(true)
  }

  async function doFetchB() {
    const res  = await fetch('https://httpbin.org/get')
    const json = await res.json() as IpData
    setIpData(json)
    setBCount(c => c + 1)
    setStepB(true)
  }

  async function doFetchC() {
    const res  = await fetch('https://httpbin.org/get')
    const json = await res.json() as IpData
    if (!json.origin || typeof json.origin !== 'string') {
      throw new Error('ValidationError: origin inválido')
    }
    setIpData(json)
    setStepC(true)
    toast({ message: 'Pipeline completo — red + validación ✓', variant: 'success' })
  }

  const btnBase: React.CSSProperties = {
    fontFamily: 'inherit', borderRadius: 5, fontWeight: 500,
    cursor: 'pointer', transition: 'all 0.15s',
  }

  return (
    <Weld.Stack gap={32}>

      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>HTTP Client</Weld.Badge>
        <Weld.Heading level={2}>El contrato entre tu frontend y tu backend</Weld.Heading>
        <Weld.Text>
          El cliente HTTP de WELD no es solo un wrapper de{' '}
          <Weld.Text variant="code" as="span">fetch</Weld.Text>. Conecta el tipo de tu backend
          directamente con tu frontend — TypeScript te avisa si la API cambia antes de que
          llegue a producción.
        </Weld.Text>
      </Weld.Stack>

      <Weld.Divider />

      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>Paso a paso</Weld.Badge>

        <Weld.Heading level={3}>1. Definí el contrato (AppRouter)</Weld.Heading>
        <Weld.Card accent>
          <Weld.Text variant="code" as="pre" style={{ fontSize: 12, lineHeight: 1.7 }}>{`// server/index.ts — backend
const server = new WeldServer({ port: 3000 })
server.get('products', z.array(ProductSchema), async () => db.products.findAll())
export type AppRouter = typeof server.router`}</Weld.Text>
        </Weld.Card>

        <Weld.Heading level={3}>2. Creá el cliente tipado</Weld.Heading>
        <Weld.Card accent>
          <Weld.Text variant="code" as="pre" style={{ fontSize: 12, lineHeight: 1.7 }}>{`import { Weld } from '@weldjs/http'
import type { AppRouter } from '../../server'

export const api = new Weld<AppRouter>('https://api.ejemplo.com')
api.get('products')   // ✅ ruta válida
api.get('usuarios')   // ❌ Error de compilación`}</Weld.Text>
        </Weld.Card>

        <Weld.Heading level={3}>3. Hacé el request en tu componente</Weld.Heading>
        <Weld.Card accent>
          <Weld.Text variant="code" as="pre" style={{ fontSize: 12, lineHeight: 1.7 }}>{`const { data, loading, error } = useWeld(
  api.get('products', z.array(ProductSchema))
)
if (loading) return <Weld.Spinner />
if (error)   return <Weld.Alert>{error.message}</Weld.Alert>
return <Weld.Table data={data} keyField="id" columns={cols} />`}</Weld.Text>
        </Weld.Card>
      </Weld.Stack>

      <Weld.Divider />

      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>Las 4 capas</Weld.Badge>
        <Weld.Heading level={3}>Pipeline de cada request</Weld.Heading>
        <Weld.Stack gap={8}>
          {([
            { n: '1', color: '#00d4ff', label: 'Deduplicación', desc: '3 componentes pidiendo los mismos datos = 1 solo hit al servidor.' },
            { n: '2', color: '#3b6bff', label: 'Reactividad',   desc: 'Signals granulares — solo se re-renderizan los componentes que usan ese dato.' },
            { n: '3', color: '#7c3aed', label: 'Red',           desc: 'Online → fetch(). Offline GET → cache IndexedDB. Offline mutación → cola local.' },
            { n: '4', color: '#22c55e', label: 'Validación',    desc: 'Zod safeParse antes de que los datos toquen tu componente.' },
          ] as const).map(({ n, color, label, desc }) => (
            <div key={n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${color}15`, border: `1px solid ${color}40`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                {n}
              </div>
              <div>
                <Weld.Text style={{ fontWeight: 700, color: '#f4f4f5', fontSize: 13 }}>{label}</Weld.Text>
                <Weld.Text variant="muted" style={{ fontSize: 12, marginTop: 2 }}>{desc}</Weld.Text>
              </div>
            </div>
          ))}
        </Weld.Stack>
      </Weld.Stack>

      <Weld.Divider />

      {/* ── Ejercicio ─────────────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content', background: 'rgba(59,107,255,0.15)', color: '#7c9fff' }}>
          Ejercicio 3 — Requests reales
        </Weld.Badge>
        <Weld.Text>
          Usamos <Weld.Text variant="code" as="span">httpbin.org</Weld.Text>, una API pública.
          Completá A → B → C en orden.
        </Weld.Text>

        {/* Paso A */}
        <Weld.Card style={{ border: stepA ? '1px solid rgba(0,212,255,0.35)' : undefined }}>
          <Weld.Stack gap={10}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, background: stepA ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)', border: stepA ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: stepA ? '#22c55e' : '#71717a' }}>
                {stepA ? '✓' : 'A'}
              </div>
              <Weld.Text style={{ fontWeight: 600, color: '#f4f4f5' }}>Capa 3 — Fetch básico</Weld.Text>
            </div>
            <Weld.Text variant="muted" style={{ fontSize: 13 }}>
              Simula la capa 3 del pipeline: solo red, sin validación ni deduplicación.
            </Weld.Text>
            <button
              onClick={doFetchA}
              style={{ ...btnBase, padding: '7px 15px', fontSize: 13, height: 36, background: stepA ? 'rgba(255,255,255,0.04)' : 'rgba(0,212,255,0.10)', border: stepA ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,212,255,0.18)', color: stepA ? '#71717a' : '#00d4ff' }}
            >
              {stepA ? 'Fetch completado ✓' : 'Hacer fetch a httpbin.org'}
            </button>
            {stepA && ipData && (
              <Weld.Alert variant="success">Respuesta recibida — IP: <strong>{ipData.origin}</strong></Weld.Alert>
            )}
          </Weld.Stack>
        </Weld.Card>

        {/* Paso B */}
        <Weld.Card style={{ border: stepB ? '1px solid rgba(0,212,255,0.35)' : undefined, opacity: stepA ? 1 : 0.4, transition: 'opacity 0.3s' }}>
          <Weld.Stack gap={10}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, background: stepB ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)', border: stepB ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: stepB ? '#22c55e' : '#71717a' }}>
                {stepB ? '✓' : 'B'}
              </div>
              <Weld.Text style={{ fontWeight: 600, color: '#f4f4f5' }}>Capa 1 — Deduplicación</Weld.Text>
            </div>
            <Weld.Text variant="muted" style={{ fontSize: 13 }}>
              Hacé click en los 3 botones. Con WELD real serían deduplicados en 1 request.
            </Weld.Text>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3].map(i => (
                <button
                  key={i}
                  onClick={() => stepA && doFetchB()}
                  style={{ ...btnBase, padding: '5px 14px', fontSize: 12, height: 30, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: stepA ? '#a1a1aa' : '#3f3f46', cursor: stepA ? 'pointer' : 'not-allowed', opacity: stepA ? 1 : 0.5 }}
                >
                  Request #{i}
                </button>
              ))}
            </div>
            {stepB && (
              <Weld.Alert variant="info">
                Hiciste {bCount} request{bCount !== 1 ? 's' : ''}. Con deduplicación: 1 hit al servidor, {bCount} componentes actualizados.
              </Weld.Alert>
            )}
          </Weld.Stack>
        </Weld.Card>

        {/* Paso C */}
        <Weld.Card style={{ border: stepC ? '1px solid rgba(34,197,94,0.35)' : undefined, opacity: stepB ? 1 : 0.4, transition: 'opacity 0.3s' }}>
          <Weld.Stack gap={10}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, background: stepC ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)', border: stepC ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: stepC ? '#22c55e' : '#71717a' }}>
                {stepC ? '✓' : 'C'}
              </div>
              <Weld.Text style={{ fontWeight: 600, color: '#f4f4f5' }}>Capa 4 — Fetch con validación</Weld.Text>
            </div>
            <Weld.Text variant="muted" style={{ fontSize: 13 }}>
              Los datos se verifican antes de llegar al componente, igual que con Zod en WELD.
            </Weld.Text>
            <button
              onClick={() => stepB && doFetchC()}
              style={{ ...btnBase, padding: '7px 15px', fontSize: 13, height: 36, background: stepB ? 'rgba(0,212,255,0.10)' : 'rgba(255,255,255,0.02)', border: stepB ? '1px solid rgba(0,212,255,0.18)' : '1px solid rgba(255,255,255,0.06)', color: stepB ? '#00d4ff' : '#3f3f46', cursor: stepB ? 'pointer' : 'not-allowed' }}
            >
              {stepC ? 'Validación completada ✓' : 'Fetch + validar datos'}
            </button>
            {stepC && (
              <Weld.Alert variant="success">
                ✓ ¡Pipeline completo! Capa 3 (red) + Capa 4 (validación). Así procesa WELD cada request.
              </Weld.Alert>
            )}
          </Weld.Stack>
        </Weld.Card>

      </Weld.Stack>
    </Weld.Stack>
  )
}
