import React, { useState } from 'react'
import { Weld, toast } from '@weldjs/react'

// ─── Datos de demo ────────────────────────────────────────────────────────────

type Package = { id: number; name: string; version: string; status: 'stable' | 'beta' | 'experimental'; downloads: number }

const PACKAGES: Package[] = [
  { id: 1, name: '@weldjs/core',   version: '0.1.2', status: 'stable',       downloads: 12840 },
  { id: 2, name: '@weldjs/react',  version: '0.3.4', status: 'stable',       downloads: 9210  },
  { id: 3, name: '@weldjs/server', version: '0.2.1', status: 'stable',       downloads: 4560  },
  { id: 4, name: '@weldjs/forms',  version: '0.2.1', status: 'stable',       downloads: 3890  },
  { id: 5, name: '@weldjs/router', version: '0.2.3', status: 'beta',         downloads: 2100  },
  { id: 6, name: '@weldjs/vue',    version: '0.1.2', status: 'experimental', downloads: 870   },
]

const statusColor = { stable: '#22c55e', beta: '#f59e0b', experimental: '#a1a1aa' }

export function Step5() {
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null)
  const [sortKey, setSortKey]         = useState<keyof Package>('downloads')
  const [clickCount, setClickCount]   = useState(0)
  const [activeTab, setActiveTab]     = useState('overview')
  const [tabDone, setTabDone]         = useState(false)

  const sorted = [...PACKAGES].sort((a, b) => {
    if (sortKey === 'downloads') return (b.downloads as number) - (a.downloads as number)
    return String(a[sortKey]).localeCompare(String(b[sortKey]))
  })

  return (
    <Weld.Stack gap={32}>

      {/* ── Concepto ──────────────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>Datos y Layout</Weld.Badge>
        <Weld.Heading level={2}>Dashboards sin reinventar la rueda</Weld.Heading>
        <Weld.Text>
          Construir un dashboard siempre implica las mismas piezas: una tabla de datos,
          métricas clave, tabs para organizar secciones, y grids responsivos. WELD los tiene
          todos, listos para conectar a tus datos.
        </Weld.Text>
      </Weld.Stack>

      <Weld.Divider />

      {/* ── Stat ──────────────────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>Weld.Stat</Weld.Badge>
        <Weld.Heading level={3}>Métricas KPI de un vistazo</Weld.Heading>
        <Weld.Text>
          <Weld.Text variant="code" as="span">Weld.Stat</Weld.Text> muestra una métrica con label, valor,
          y un indicador de tendencia opcional. Ideal para la parte superior de dashboards.
        </Weld.Text>
        <Weld.Card>
          <Weld.Text variant="code" as="pre" style={{ fontSize: 12 }}>{`<Weld.Stat
  label="Descargas totales"
  value="33,470"
  trend="up"     // 'up' | 'down' | undefined
/>`}</Weld.Text>
        </Weld.Card>
        <Weld.Grid cols={4} gap={12}>
          <Weld.Stat label="Paquetes"   value="14"      />
          <Weld.Stat label="Descargas"  value="33,470"  trend="up" />
          <Weld.Stat label="Versión"    value="v0.3.4"  />
          <Weld.Stat label="Cobertura"  value="68%"     trend="up" />
        </Weld.Grid>
      </Weld.Stack>

      <Weld.Divider />

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>Weld.Table</Weld.Badge>
        <Weld.Heading level={3}>Tablas con columnas configurables</Weld.Heading>
        <Weld.Text>
          <Weld.Text variant="code" as="span">Weld.Table</Weld.Text> recibe un array de{' '}
          <Weld.Text variant="code" as="span">columns</Weld.Text> y un array de{' '}
          <Weld.Text variant="code" as="span">data</Weld.Text>. Cada columna puede tener un{' '}
          <Weld.Text variant="code" as="span">render</Weld.Text> custom para mostrar badges, iconos,
          o cualquier componente.
        </Weld.Text>
        <Weld.Card>
          <Weld.Text variant="code" as="pre" style={{ fontSize: 12 }}>{`<Weld.Table
  keyField="id"
  data={packages}
  columns={[
    { key: 'name',      label: 'Paquete' },
    { key: 'version',   label: 'Versión',
      render: (v) => <Weld.Badge>{v}</Weld.Badge> },
    { key: 'downloads', label: 'Descargas',
      render: (v) => Number(v).toLocaleString() },
  ]}
  onRowClick={(row) => console.log(row)}
/>`}</Weld.Text>
        </Weld.Card>

        {/* Ejercicio tabla */}
        <Weld.Card style={{ border: '1px solid rgba(59,107,255,0.3)', background: 'rgba(59,107,255,0.04)' }}>
          <Weld.Stack gap={12}>
            <Weld.Badge style={{ width: 'fit-content', background: 'rgba(59,107,255,0.15)', color: '#7c9fff' }}>
              Ejercicio 5.1 — Tabla interactiva
            </Weld.Badge>
            <Weld.Text style={{ fontWeight: 600, color: '#f4f4f5' }}>
              Hacé click en las filas y cambiá el orden
            </Weld.Text>
            <Weld.Stack direction="row" gap={8} style={{ alignItems: 'center' }}>
              <Weld.Text variant="muted" style={{ fontSize: 13 }}>Ordenar por:</Weld.Text>
              {(['name', 'downloads', 'status'] as const).map(k => (
                <Weld.Button
                  key={k}
                  size="sm"
                  variant={sortKey === k ? 'primary' : 'ghost'}
                  action={() => { setSortKey(k); return Promise.resolve() }}
                >
                  {k}
                </Weld.Button>
              ))}
            </Weld.Stack>
            <Weld.Table
              keyField="id"
              data={sorted}
              columns={[
                { key: 'name',    label: 'Paquete',   render: (v) => <span style={{ fontWeight: 600, color: '#f4f4f5', fontFamily: 'monospace', fontSize: 12 }}>{String(v)}</span> },
                { key: 'version', label: 'Versión',   render: (v) => <Weld.Badge>{String(v)}</Weld.Badge> },
                { key: 'status',  label: 'Estado',    render: (v) => <span style={{ color: statusColor[v as keyof typeof statusColor], fontWeight: 600, fontSize: 12 }}>{String(v)}</span> },
                { key: 'downloads', label: 'Descargas', render: (v) => <span style={{ color: '#a1a1aa' }}>{Number(v).toLocaleString()}</span> },
              ]}
              onRowClick={(row) => {
                setSelectedPkg(row as Package)
                const nc = clickCount + 1
                setClickCount(nc)
                toast({ message: `Seleccionaste ${row.name}`, variant: 'info' })
              }}
            />
            {selectedPkg && (
              <Weld.Alert variant="info">
                Fila seleccionada: <strong>{selectedPkg.name}</strong> — {selectedPkg.downloads.toLocaleString()} descargas
              </Weld.Alert>
            )}
            {clickCount >= 2 && <Weld.Alert variant="success">✓ ¡Bien! Viste cómo onRowClick recibe el objeto completo de la fila.</Weld.Alert>}
          </Weld.Stack>
        </Weld.Card>
      </Weld.Stack>

      <Weld.Divider />

      {/* ── Tabs ──────────────────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>Weld.Tabs</Weld.Badge>
        <Weld.Heading level={3}>Organizá contenido en secciones</Weld.Heading>
        <Weld.Text>
          <Weld.Text variant="code" as="span">Weld.Tabs</Weld.Text> recibe un array de items, cada
          uno con <Weld.Text variant="code" as="span">key</Weld.Text>,{' '}
          <Weld.Text variant="code" as="span">label</Weld.Text> y{' '}
          <Weld.Text variant="code" as="span">content</Weld.Text>. El contenido puede ser
          cualquier componente React.
        </Weld.Text>

        {/* Ejercicio tabs */}
        <Weld.Card style={{ border: '1px solid rgba(59,107,255,0.3)', background: 'rgba(59,107,255,0.04)' }}>
          <Weld.Stack gap={12}>
            <Weld.Badge style={{ width: 'fit-content', background: 'rgba(59,107,255,0.15)', color: '#7c9fff' }}>
              Ejercicio 5.2 — Visitá todas las tabs
            </Weld.Badge>
            <Weld.Tabs
              items={[
                {
                  key: 'overview',
                  label: '📊 Overview',
                  content: (
                    <Weld.Stack gap={12} style={{ padding: '16px 0' }}>
                      <Weld.Text>Esta es la tab de overview. Navegá a las otras dos para completar el ejercicio.</Weld.Text>
                      <Weld.Grid cols={3} gap={12}>
                        <Weld.Stat label="Total paquetes" value="14" />
                        <Weld.Stat label="Stable"         value="4"  trend="up" />
                        <Weld.Stat label="En desarrollo"  value="2"  />
                      </Weld.Grid>
                    </Weld.Stack>
                  ),
                },
                {
                  key: 'docs',
                  label: '📚 Documentación',
                  content: (
                    <Weld.Stack gap={12} style={{ padding: '16px 0' }}>
                      <Weld.Text>La documentación completa está en <Weld.Text variant="code" as="span">weld-docs.vercel.app</Weld.Text>.</Weld.Text>
                      <Weld.Alert variant="info">Cubre todos los paquetes, con ejemplos en inglés y español.</Weld.Alert>
                    </Weld.Stack>
                  ),
                },
                {
                  key: 'code',
                  label: '💻 Código',
                  content: (
                    <Weld.Stack gap={12} style={{ padding: '16px 0' }}>
                      <Weld.Text variant="code" as="pre" style={{ fontSize: 12 }}>{`<Weld.Tabs
  items={[
    { key: 'a', label: 'Tab A', content: <ComponenteA /> },
    { key: 'b', label: 'Tab B', content: <ComponenteB /> },
  ]}
/>`}</Weld.Text>
                    </Weld.Stack>
                  ),
                },
              ]}
            />
            {tabDone && <Weld.Alert variant="success">✓ ¡Exploraste todas las tabs!</Weld.Alert>}
          </Weld.Stack>
        </Weld.Card>
      </Weld.Stack>

    </Weld.Stack>
  )
}
