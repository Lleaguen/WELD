import React, { useState } from 'react'
import { Weld, toast } from '@weldjs/react'

export function Step2() {
  // Estado del ejercicio
  const [ex1Done, setEx1Done]   = useState(false)
  const [ex2Done, setEx2Done]   = useState(false)
  const [ex3Done, setEx3Done]   = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [variant, setVariant]   = useState<'primary' | 'secondary' | 'ghost' | 'danger'>('primary')

  return (
    <Weld.Stack gap={32}>

      {/* ── Concepto ──────────────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>Componentes</Weld.Badge>
        <Weld.Heading level={2}>Todo bajo el namespace Weld.*</Weld.Heading>
        <Weld.Text>
          WELD expone todos sus componentes bajo un único namespace:{' '}
          <Weld.Text variant="code" as="span">Weld.*</Weld.Text>. No necesitás hacer 15 imports
          distintos ni recordar de qué archivo viene cada cosa.
        </Weld.Text>
        <Weld.Card accent>
          <Weld.Text variant="code" as="pre">{`import { Weld } from '@weldjs/react'

// Todos los componentes disponibles:
<Weld.Button />   <Weld.Card />    <Weld.Input />
<Weld.Modal />    <Weld.Table />   <Weld.Alert />
<Weld.Shell />    <Weld.Header />  <Weld.Sidebar />
// ... y muchos más`}</Weld.Text>
        </Weld.Card>
      </Weld.Stack>

      <Weld.Divider />

      {/* ── Button ────────────────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>Weld.Button</Weld.Badge>
        <Weld.Heading level={3}>El botón que se conecta a la red</Weld.Heading>
        <Weld.Text>
          <Weld.Text variant="code" as="span">Weld.Button</Weld.Text> no es un botón normal.
          Tiene una prop <Weld.Text variant="code" as="span">action</Weld.Text> que acepta cualquier
          función que devuelva una Promise. Cuando la Promise está pendiente, el botón se pone en
          estado <em>loading</em>. Cuando resuelve, muestra <em>success</em>. Si falla, <em>error</em>.
          Todo automático.
        </Weld.Text>

        <Weld.Card>
          <Weld.Text variant="code" as="pre" style={{ fontSize: 12 }}>{`// La prop action reemplaza onClick
<Weld.Button
  action={() => api.post('orders', Schema, { body: data })}
>
  Crear orden
</Weld.Button>

// Sin action, funciona como botón normal
<Weld.Button onClick={() => setOpen(true)}>
  Abrir modal
</Weld.Button>`}</Weld.Text>
        </Weld.Card>

        <Weld.Text style={{ fontWeight: 600, color: '#f4f4f5' }}>Las 4 variantes:</Weld.Text>
        <Weld.Grid cols={4} gap={10}>
          {(['primary', 'secondary', 'ghost', 'danger'] as const).map(v => (
            <Weld.Stack key={v} gap={6}>
              <Weld.Text variant="muted" style={{ fontSize: 11 }}>{v}</Weld.Text>
              <Weld.Button variant={v} action={() => new Promise(res => setTimeout(res, 1200))}>
                Click
              </Weld.Button>
            </Weld.Stack>
          ))}
        </Weld.Grid>
        <Weld.Text variant="muted" style={{ fontSize: 13 }}>
          Hacé click en cualquier botón — todos simulan una promesa de 1.2s para mostrar el ciclo loading → success.
        </Weld.Text>
      </Weld.Stack>

      {/* Ejercicio 1 */}
      <Weld.Card style={{ border: '1px solid rgba(59,107,255,0.3)', background: 'rgba(59,107,255,0.04)' }}>
        <Weld.Stack gap={12}>
          <Weld.Badge style={{ width: 'fit-content', background: 'rgba(59,107,255,0.15)', color: '#7c9fff' }}>
            Ejercicio 2.1
          </Weld.Badge>
          <Weld.Text style={{ fontWeight: 600, color: '#f4f4f5' }}>
            Hacé click en el botón de danger y observá el estado de error
          </Weld.Text>
          <Weld.Text variant="muted" style={{ fontSize: 13 }}>
            Este botón rechaza la promesa intencionalmente. Vas a ver el shake animation y el estado error.
          </Weld.Text>
          <Weld.Button
            variant="danger"
            action={() => new Promise((_, rej) => setTimeout(() => { rej(new Error('Error simulado')); setEx1Done(true) }, 900))}
          >
            Simular error de red
          </Weld.Button>
          {ex1Done && <Weld.Alert variant="success">✓ ¡Perfecto! Viste el ciclo de error. El botón vuelve solo a idle en 2 segundos.</Weld.Alert>}
        </Weld.Stack>
      </Weld.Card>

      <Weld.Divider />

      {/* ── Input ─────────────────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>Weld.Input</Weld.Badge>
        <Weld.Heading level={3}>Input con validación integrada</Weld.Heading>
        <Weld.Text>
          <Weld.Text variant="code" as="span">Weld.Input</Weld.Text> acepta una prop{' '}
          <Weld.Text variant="code" as="span">error</Weld.Text> para mostrar mensajes de validación,
          y cambia el estilo del borde automáticamente. El neon se activa en focus.
        </Weld.Text>
        <Weld.Card>
          <Weld.Text variant="code" as="pre" style={{ fontSize: 12 }}>{`<Weld.Input
  label="Email"
  type="email"
  placeholder="franco@ejemplo.com"
  value={email}
  onChange={setEmail}
  error={touched && !isValid ? 'Email inválido' : undefined}
/>`}</Weld.Text>
        </Weld.Card>
      </Weld.Stack>

      {/* Ejercicio 2 */}
      <Weld.Card style={{ border: '1px solid rgba(59,107,255,0.3)', background: 'rgba(59,107,255,0.04)' }}>
        <Weld.Stack gap={12}>
          <Weld.Badge style={{ width: 'fit-content', background: 'rgba(59,107,255,0.15)', color: '#7c9fff' }}>
            Ejercicio 2.2
          </Weld.Badge>
          <Weld.Text style={{ fontWeight: 600, color: '#f4f4f5' }}>
            Escribí algo en el input y observá cómo se activa el neon en focus
          </Weld.Text>
          <Weld.Input
            label="Probá el input"
            placeholder="Escribí cualquier cosa..."
            value={inputVal}
            onChange={(v) => { setInputVal(v); if (v.length >= 3 && !ex2Done) setEx2Done(true) }}
            error={inputVal.length === 1 || inputVal.length === 2 ? 'Seguí escribiendo...' : undefined}
          />
          {ex2Done && (
            <Weld.Alert variant="success">
              ✓ ¡Bien! Notaste el borde cyan en focus — ese es el neon de WELD. Se activa <em>solo</em> en estados interactivos.
            </Weld.Alert>
          )}
        </Weld.Stack>
      </Weld.Card>

      <Weld.Divider />

      {/* ── Layout ────────────────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>Layout</Weld.Badge>
        <Weld.Heading level={3}>Stack y Grid — el layout sin CSS</Weld.Heading>
        <Weld.Text>
          En vez de escribir <Weld.Text variant="code" as="span">display: flex; gap: 16px</Weld.Text> mil
          veces, WELD tiene <Weld.Text variant="code" as="span">Weld.Stack</Weld.Text> y{' '}
          <Weld.Text variant="code" as="span">Weld.Grid</Weld.Text> que resuelven el 90% de los layouts.
        </Weld.Text>
        <Weld.Grid cols={2} gap={16}>
          <Weld.Card title="Weld.Stack">
            <Weld.Text variant="code" as="pre" style={{ fontSize: 11 }}>{`// vertical (default)
<Weld.Stack gap={12}>
  <ComponenteA />
  <ComponenteB />
</Weld.Stack>

// horizontal
<Weld.Stack direction="row" gap={8}>
  <BtnA />
  <BtnB />
</Weld.Stack>`}</Weld.Text>
          </Weld.Card>
          <Weld.Card title="Weld.Grid">
            <Weld.Text variant="code" as="pre" style={{ fontSize: 11 }}>{`// 3 columnas iguales
<Weld.Grid cols={3} gap={16}>
  <Card />
  <Card />
  <Card />
</Weld.Grid>

// responsive automático
<Weld.Grid cols={{ mobile: 1, desktop: 3 }}>
  ...
</Weld.Grid>`}</Weld.Text>
          </Weld.Card>
        </Weld.Grid>
      </Weld.Stack>

      {/* Ejercicio 3 */}
      <Weld.Card style={{ border: '1px solid rgba(59,107,255,0.3)', background: 'rgba(59,107,255,0.04)' }}>
        <Weld.Stack gap={12}>
          <Weld.Badge style={{ width: 'fit-content', background: 'rgba(59,107,255,0.15)', color: '#7c9fff' }}>
            Ejercicio 2.3
          </Weld.Badge>
          <Weld.Text style={{ fontWeight: 600, color: '#f4f4f5' }}>
            Elegí una variante y hacé click en el botón para completar el paso
          </Weld.Text>
          <Weld.Stack direction="row" gap={8} style={{ flexWrap: 'wrap' }}>
            {(['primary', 'secondary', 'ghost', 'danger'] as const).map(v => (
              <Weld.Button
                key={v}
                variant={variant === v ? 'primary' : 'ghost'}
                size="sm"
                action={() => { setVariant(v); return Promise.resolve() }}
              >
                {v}
              </Weld.Button>
            ))}
          </Weld.Stack>
          <Weld.Text variant="muted" style={{ fontSize: 13 }}>
            Variante seleccionada: <Weld.Text variant="code" as="span">{variant}</Weld.Text>
          </Weld.Text>
          <Weld.Button
            variant={variant}
            action={() => new Promise(res => setTimeout(() => { res(undefined); setEx3Done(true); toast({ message: `Usaste el botón ${variant} correctamente`, variant: 'success' }) }, 800))}
          >
            Probar variante {variant}
          </Weld.Button>
          {ex3Done && <Weld.Alert variant="success">✓ ¡Dominás los componentes básicos!</Weld.Alert>}
        </Weld.Stack>
      </Weld.Card>

    </Weld.Stack>
  )
}
