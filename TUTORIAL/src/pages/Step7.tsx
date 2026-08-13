import React, { useState } from 'react'
import { Weld, toast } from '@weldjs/react'

export function Step7() {
  const [tiltMax,     setTiltMax]     = useState(8)
  const [tiltScale,   setTiltScale]   = useState(102)   // * 0.01
  const [neonColor,   setNeonColor]   = useState('#00d4ff')
  const [neonEnabled, setNeonEnabled] = useState(true)
  const [tiltEnabled, setTiltEnabled] = useState(true)
  const [configured,  setConfigured]  = useState(false)

  const tiltConfig = tiltEnabled ? { max: tiltMax, scale: tiltScale / 100, speed: 200 } : false
  const neonConfig = neonEnabled
    ? (neonColor === '#00d4ff' ? true : { color: neonColor })
    : false

  return (
    <Weld.Stack gap={32}>

      {/* ── Concepto ──────────────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>Tilt & Neon</Weld.Badge>
        <Weld.Heading level={2}>Efectos visuales opcionales y configurables</Weld.Heading>
        <Weld.Text>
          WELD tiene dos sistemas de efectos visuales que siguen exactamente el mismo patrón de API:
          la prop <Weld.Text variant="code" as="span">neon</Weld.Text> (el plasma luminoso en estados
          activos) y la prop <Weld.Text variant="code" as="span">tilt</Weld.Text> (inclinación 3D al
          mover el mouse). Ambos son opt-in, configurables, y completamente desactivables.
        </Weld.Text>
      </Weld.Stack>

      <Weld.Divider />

      {/* ── Patrón de API ─────────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>El patrón</Weld.Badge>
        <Weld.Heading level={3}>boolean | Config | 'none' — siempre igual</Weld.Heading>
        <Weld.Text>
          La prop <Weld.Text variant="code" as="span">neon</Weld.Text> y la prop{' '}
          <Weld.Text variant="code" as="span">tilt</Weld.Text> aceptan exactamente las mismas 4 formas.
          Una vez que aprendés el patrón con una, sabés usarlas con la otra y con cualquier efecto
          que WELD agregue en el futuro.
        </Weld.Text>

        <Weld.Grid cols={2} gap={16}>
          <Weld.Card title="Prop neon">
            <Weld.Text variant="code" as="pre" style={{ fontSize: 11, lineHeight: 1.75 }}>{`// true → efecto con defaults
<Weld.Button neon>Hover me</Weld.Button>

// Objeto → config personalizada
<Weld.Button neon={{ color: '#a855f7', intensity: 0.8 }}>
  Hover me
</Weld.Button>

// false → estilos Weld sí, glow no
<Weld.Button neon={false}>Sin glow</Weld.Button>

// 'none' → sin estilos Weld — BYO CSS
<Weld.Button neon="none">BYO CSS</Weld.Button>`}</Weld.Text>
          </Weld.Card>

          <Weld.Card title="Prop tilt">
            <Weld.Text variant="code" as="pre" style={{ fontSize: 11, lineHeight: 1.75 }}>{`// true → efecto con defaults (8°, scale 1.02)
<Weld.Card tilt>Hover me</Weld.Card>

// Objeto → config personalizada
<Weld.Card tilt={{ max: 5, scale: 1.01, speed: 300 }}>
  Hover me
</Weld.Card>

// false → sin tilt (default de todos los componentes)
<Weld.Card tilt={false}>Sin tilt</Weld.Card>

// 'none' → sin tilt ni will-change hint
<Weld.Card tilt="none">Sin hint</Weld.Card>`}</Weld.Text>
          </Weld.Card>
        </Weld.Grid>

        <Weld.Alert variant="info">
          <strong>Importante:</strong> <Weld.Text variant="code" as="span">tilt</Weld.Text> es{' '}
          <Weld.Text variant="code" as="span">false</Weld.Text> por defecto en todos los componentes —
          es opt-in. <Weld.Text variant="code" as="span">neon</Weld.Text> es{' '}
          <Weld.Text variant="code" as="span">true</Weld.Text> por defecto en Button,{' '}
          pero <Weld.Text variant="code" as="span">false</Weld.Text> por defecto en Card.
          WELD respeta automáticamente <Weld.Text variant="code" as="span">prefers-reduced-motion</Weld.Text>.
        </Weld.Alert>
      </Weld.Stack>

      <Weld.Divider />

      {/* ── Dónde están disponibles ───────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>Disponibilidad</Weld.Badge>
        <Weld.Heading level={3}>¿En qué componentes está cada prop?</Weld.Heading>
        <Weld.Grid cols={2} gap={16}>
          <Weld.Card title="neon">
            <Weld.Stack gap={6}>
              {[
                ['Weld.Button', 'default: true'],
                ['Weld.Input',  'neon en focus'],
                ['Weld.Header', 'neon en el dot de online'],
              ].map(([comp, note]) => (
                <div key={comp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Weld.Text variant="code" as="span" style={{ fontSize: 12 }}>{comp}</Weld.Text>
                  <Weld.Text variant="muted" style={{ fontSize: 11 }}>{note}</Weld.Text>
                </div>
              ))}
            </Weld.Stack>
          </Weld.Card>
          <Weld.Card title="tilt">
            <Weld.Stack gap={6}>
              {[
                ['Weld.Card',   'default: false'],
                ['Weld.Button', 'default: false'],
                ['Weld.Modal',  'default: false — tilt + animación 3D'],
              ].map(([comp, note]) => (
                <div key={comp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Weld.Text variant="code" as="span" style={{ fontSize: 12 }}>{comp}</Weld.Text>
                  <Weld.Text variant="muted" style={{ fontSize: 11 }}>{note}</Weld.Text>
                </div>
              ))}
            </Weld.Stack>
          </Weld.Card>
        </Weld.Grid>
      </Weld.Stack>

      <Weld.Divider />

      {/* ── Ejercicio interactivo ─────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content', background: 'rgba(59,107,255,0.15)', color: '#7c9fff' }}>
          Ejercicio 7 — Configurador en vivo
        </Weld.Badge>
        <Weld.Heading level={3}>Ajustá los valores y ve el resultado en tiempo real</Weld.Heading>
        <Weld.Text>
          Modificá los controles de la izquierda y mirá cómo cambia la card de la derecha.
          Así es como configurás los efectos en tu propia app.
        </Weld.Text>

        <Weld.Grid cols={2} gap={20}>
          {/* Controles */}
          <Weld.Card title="Configuración">
            <Weld.Stack gap={16}>
              <Weld.Stack gap={8}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Weld.Text style={{ fontSize: 13, fontWeight: 600, color: '#f4f4f5' }}>
                    Tilt activo
                  </Weld.Text>
                  <Weld.Button
                    size="sm"
                    variant={tiltEnabled ? 'primary' : 'secondary'}
                    action={() => { setTiltEnabled(e => !e); return Promise.resolve() }}
                  >
                    {tiltEnabled ? 'ON' : 'OFF'}
                  </Weld.Button>
                </div>
                {tiltEnabled && (
                  <>
                    <div>
                      <Weld.Text variant="muted" style={{ fontSize: 12 }}>max: {tiltMax}°</Weld.Text>
                      <input type="range" min={2} max={20} value={tiltMax}
                        onChange={e => setTiltMax(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#00d4ff' }} />
                    </div>
                    <div>
                      <Weld.Text variant="muted" style={{ fontSize: 12 }}>scale: {(tiltScale / 100).toFixed(2)}x</Weld.Text>
                      <input type="range" min={100} max={115} value={tiltScale}
                        onChange={e => setTiltScale(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#00d4ff' }} />
                    </div>
                  </>
                )}
              </Weld.Stack>

              <Weld.Divider />

              <Weld.Stack gap={8}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Weld.Text style={{ fontSize: 13, fontWeight: 600, color: '#f4f4f5' }}>
                    Neon activo
                  </Weld.Text>
                  <Weld.Button
                    size="sm"
                    variant={neonEnabled ? 'primary' : 'secondary'}
                    action={() => { setNeonEnabled(e => !e); return Promise.resolve() }}
                  >
                    {neonEnabled ? 'ON' : 'OFF'}
                  </Weld.Button>
                </div>
                {neonEnabled && (
                  <div>
                    <Weld.Text variant="muted" style={{ fontSize: 12 }}>Color plasma</Weld.Text>
                    <Weld.Stack direction="row" gap={6} style={{ marginTop: 6, flexWrap: 'wrap' }}>
                      {['#00d4ff', '#a855f7', '#22c55e', '#f59e0b', '#ec4899', '#3b6bff'].map(c => (
                        <button
                          key={c}
                          onClick={() => setNeonColor(c)}
                          style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: c, border: neonColor === c ? '2px solid #fff' : '2px solid transparent',
                            cursor: 'pointer', flexShrink: 0,
                          }}
                        />
                      ))}
                    </Weld.Stack>
                  </div>
                )}
              </Weld.Stack>

              <Weld.Text variant="code" as="pre" style={{ fontSize: 10, background: 'rgba(0,212,255,0.04)', padding: 10, borderRadius: 6, border: '1px solid rgba(0,212,255,0.1)' }}>
                {`<Weld.Card
  tilt={${tiltEnabled
    ? `{ max: ${tiltMax}, scale: ${(tiltScale/100).toFixed(2)} }`
    : 'false'}}
>
  <Weld.Button
    neon={${neonEnabled
    ? neonColor === '#00d4ff' ? 'true' : `{ color: '${neonColor}' }`
    : 'false'}}
  >
    Hover me
  </Weld.Button>
</Weld.Card>`}
              </Weld.Text>
            </Weld.Stack>
          </Weld.Card>

          {/* Preview en vivo */}
          <Weld.Card
            title="Preview en vivo"
            tilt={tiltConfig as any}
          >
            <Weld.Stack gap={16}>
              <Weld.Text variant="muted" style={{ fontSize: 13 }}>
                {tiltEnabled ? 'Mové el mouse sobre esta card para ver el tilt.' : 'Tilt desactivado.'}
              </Weld.Text>
              <Weld.Button
                neon={neonConfig as any}
                action={() => {
                  if (!configured) setConfigured(true)
                  toast({ message: 'Efecto configurado y aplicado', variant: 'success' })
                  return Promise.resolve()
                }}
              >
                Hover me
              </Weld.Button>
              <div style={{ fontSize: 12, color: '#3f3f46', fontFamily: 'monospace' }}>
                tilt: {tiltEnabled ? `max=${tiltMax}° scale=${(tiltScale/100).toFixed(2)}x` : 'OFF'}{' '}
                | neon: {neonEnabled ? neonColor : 'OFF'}
              </div>
            </Weld.Stack>
          </Weld.Card>
        </Weld.Grid>

        {configured && (
          <Weld.Alert variant="success">
            ✓ ¡Configuraste tus propios efectos visuales! Ahora sabés cómo personalizar cada componente en tu app.
          </Weld.Alert>
        )}
      </Weld.Stack>

    </Weld.Stack>
  )
}
