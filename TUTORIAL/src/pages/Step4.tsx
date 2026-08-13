import React, { useState } from 'react'
import { Weld, toast } from '@weldjs/react'

export function Step4() {
  const [modalOpen,    setModalOpen]    = useState(false)
  const [modalConfirmed, setModalConfirmed] = useState(false)
  const [toastCount,   setToastCount]   = useState(0)
  const [tooltipDone,  setTooltipDone]  = useState(false)
  const [dropdownDone, setDropdownDone] = useState(false)
  const [allDone,      setAllDone]      = useState(false)

  const checkAllDone = (tc: number, md: boolean, tt: boolean, dd: boolean) => {
    if (tc >= 3 && md && tt && dd) setAllDone(true)
  }

  return (
    <Weld.Stack gap={32}>

      {/* ── Concepto ──────────────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>Feedback & Overlays</Weld.Badge>
        <Weld.Heading level={2}>Comunicá el estado de tu app</Weld.Heading>
        <Weld.Text>
          Una app bien hecha le dice al usuario qué está pasando en todo momento. ¿Se está cargando algo?
          ¿Hubo un error? ¿Se guardó? WELD tiene componentes específicos para cada situación,
          listos para usar sin configuración.
        </Weld.Text>
      </Weld.Stack>

      <Weld.Divider />

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>Weld.Toast</Weld.Badge>
        <Weld.Heading level={3}>Notificaciones no bloqueantes</Weld.Heading>
        <Weld.Text>
          Los toasts aparecen en la esquina y desaparecen solos. Se usan para confirmar acciones
          que ya sucedieron — guardado, enviado, copiado, etc. Son no-bloqueantes: el usuario
          puede seguir usando la app mientras aparece.
        </Weld.Text>
        <Weld.Card>
          <Weld.Text variant="code" as="pre" style={{ fontSize: 12 }}>{`import { toast } from '@weldjs/react'

// Uso imperativo — llamalo desde cualquier parte
toast({ message: '¡Guardado!',        variant: 'success' })
toast({ message: 'Algo falló',        variant: 'error' })
toast({ message: 'Revisá esto',       variant: 'warning' })
toast({ message: 'Nueva notificación',variant: 'info' })

// Con duración personalizada (ms)
toast({ message: 'Procesando...', variant: 'info', duration: 5000 })`}</Weld.Text>
        </Weld.Card>
        <Weld.Alert variant="info">
          Para que los toasts funcionen, necesitás <Weld.Text variant="code" as="span">{'<Weld.ToastProvider />'}</Weld.Text> en
          el root de tu app (al mismo nivel que WeldProvider).
        </Weld.Alert>
      </Weld.Stack>

      {/* Ejercicio toast */}
      <Weld.Card style={{ border: '1px solid rgba(59,107,255,0.3)', background: 'rgba(59,107,255,0.04)' }}>
        <Weld.Stack gap={12}>
          <Weld.Badge style={{ width: 'fit-content', background: 'rgba(59,107,255,0.15)', color: '#7c9fff' }}>
            Ejercicio 4.1 — Toasts ({toastCount}/3)
          </Weld.Badge>
          <Weld.Text style={{ fontWeight: 600, color: '#f4f4f5' }}>
            Disparó los 3 tipos de toast diferentes
          </Weld.Text>
          <Weld.Stack direction="row" gap={8} style={{ flexWrap: 'wrap' }}>
            {[
              { v: 'success' as const, label: '✓ Success', msg: 'Operación completada' },
              { v: 'error'   as const, label: '✗ Error',   msg: 'Algo salió mal' },
              { v: 'warning' as const, label: '⚠ Warning', msg: 'Revisá antes de continuar' },
              { v: 'info'    as const, label: 'ℹ Info',    msg: 'Nueva información disponible' },
            ].map(({ v, label, msg }) => (
              <Weld.Button
                key={v}
                size="sm"
                variant="secondary"
                action={() => {
                  toast({ message: msg, variant: v })
                  const newCount = toastCount + 1
                  setToastCount(newCount)
                  checkAllDone(newCount, modalConfirmed, tooltipDone, dropdownDone)
                  return Promise.resolve()
                }}
              >
                {label}
              </Weld.Button>
            ))}
          </Weld.Stack>
          {toastCount >= 3 && <Weld.Alert variant="success">✓ ¡Bien! Ya conocés los 4 tipos de toast.</Weld.Alert>}
        </Weld.Stack>
      </Weld.Card>

      <Weld.Divider />

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>Weld.Modal</Weld.Badge>
        <Weld.Heading level={3}>Diálogos que bloquean la acción</Weld.Heading>
        <Weld.Text>
          Los modales se usan cuando querés que el usuario confirme algo antes de proceder — borrar,
          enviar un pago, cambiar un setting importante. WELD maneja automáticamente:
        </Weld.Text>
        <Weld.Stack gap={6} style={{ paddingLeft: 16 }}>
          {[
            'Bloqueo del scroll del body mientras está abierto',
            'Cierre con la tecla Escape',
            'Cierre al hacer click en el backdrop',
            'Animación de entrada/salida',
          ].map(item => (
            <Weld.Text key={item} variant="muted" style={{ fontSize: 13 }}>• {item}</Weld.Text>
          ))}
        </Weld.Stack>
        <Weld.Card>
          <Weld.Text variant="code" as="pre" style={{ fontSize: 12 }}>{`const [open, setOpen] = useState(false)

<Weld.Button action={() => { setOpen(true); return Promise.resolve() }}>
  Borrar cuenta
</Weld.Button>

<Weld.Modal
  open={open}
  onClose={() => setOpen(false)}
  title="¿Confirmar borrado?"
>
  <p>Esta acción no se puede deshacer.</p>
  <Weld.Stack direction="row" justify="flex-end" gap={8}>
    <Weld.Button variant="ghost"
      action={() => { setOpen(false); return Promise.resolve() }}>
      Cancelar
    </Weld.Button>
    <Weld.Button variant="danger" action={handleDelete}>
      Borrar
    </Weld.Button>
  </Weld.Stack>
</Weld.Modal>`}</Weld.Text>
        </Weld.Card>
      </Weld.Stack>

      {/* Ejercicio modal */}
      <Weld.Card style={{ border: '1px solid rgba(59,107,255,0.3)', background: 'rgba(59,107,255,0.04)' }}>
        <Weld.Stack gap={12}>
          <Weld.Badge style={{ width: 'fit-content', background: 'rgba(59,107,255,0.15)', color: '#7c9fff' }}>
            Ejercicio 4.2 — Modal
          </Weld.Badge>
          <Weld.Text style={{ fontWeight: 600, color: '#f4f4f5' }}>
            Abrí el modal y confirmá la acción
          </Weld.Text>
          <Weld.Text variant="muted" style={{ fontSize: 13 }}>
            Probá también cerrarlo con Escape o haciendo click afuera.
          </Weld.Text>
          <Weld.Button
            action={() => { setModalOpen(true); return Promise.resolve() }}
            variant={modalConfirmed ? 'secondary' : 'primary'}
          >
            {modalConfirmed ? 'Modal completado ✓' : 'Abrir modal'}
          </Weld.Button>
          {modalConfirmed && <Weld.Alert variant="success">✓ ¡Bien! Entendés cuándo usar modales vs toasts.</Weld.Alert>}
        </Weld.Stack>
      </Weld.Card>

      {/* Modal real */}
      <Weld.Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Ejercicio: confirmá la acción"
        tilt
      >
        <Weld.Stack gap={16}>
          <Weld.Text>
            Este modal tiene <Weld.Text variant="code" as="span">tilt</Weld.Text> activo —
            mové el mouse sobre él para ver el efecto 3D.
          </Weld.Text>
          <Weld.Alert variant="warning">
            Esta sería una acción destructiva en una app real. El usuario DEBE confirmar conscientemente.
          </Weld.Alert>
          <Weld.Stack direction="row" justify="flex-end" gap={8}>
            <Weld.Button
              variant="ghost"
              action={() => { setModalOpen(false); return Promise.resolve() }}
            >
              Cancelar
            </Weld.Button>
            <Weld.Button
              variant="primary"
              action={() => new Promise(res => setTimeout(() => {
                setModalOpen(false)
                setModalConfirmed(true)
                checkAllDone(toastCount, true, tooltipDone, dropdownDone)
                toast({ message: 'Acción confirmada correctamente', variant: 'success' })
                res(undefined)
              }, 800))}
            >
              Confirmar
            </Weld.Button>
          </Weld.Stack>
        </Weld.Stack>
      </Weld.Modal>

      <Weld.Divider />

      {/* ── Tooltip + Dropdown ────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>Tooltip & Dropdown</Weld.Badge>
        <Weld.Heading level={3}>Información contextual y menús</Weld.Heading>
        <Weld.Grid cols={2} gap={16}>
          <Weld.Card title="Weld.Tooltip">
            <Weld.Stack gap={10}>
              <Weld.Text variant="muted" style={{ fontSize: 13 }}>
                Hover sobre los botones para ver los tooltips en cada posición.
              </Weld.Text>
              <Weld.Stack direction="row" gap={8} style={{ flexWrap: 'wrap' }}>
                {(['top', 'bottom', 'left', 'right'] as const).map(pos => (
                  <Weld.Tooltip key={pos} content={`Posición: ${pos}`} position={pos}>
                    <Weld.Button
                      size="sm"
                      variant="secondary"
                      action={() => { if (!tooltipDone) { setTooltipDone(true); checkAllDone(toastCount, modalConfirmed, true, dropdownDone) } return Promise.resolve() }}
                    >
                      {pos}
                    </Weld.Button>
                  </Weld.Tooltip>
                ))}
              </Weld.Stack>
              {tooltipDone && <Weld.Text variant="muted" style={{ fontSize: 12, color: '#22c55e' }}>✓ Tooltip explorado</Weld.Text>}
            </Weld.Stack>
          </Weld.Card>

          <Weld.Card title="Weld.Dropdown">
            <Weld.Stack gap={10}>
              <Weld.Text variant="muted" style={{ fontSize: 13 }}>
                Click en el botón para ver el dropdown.
              </Weld.Text>
              <Weld.Dropdown
                trigger={<Weld.Button size="sm" variant="secondary" action={() => Promise.resolve()}>Opciones ↓</Weld.Button>}
                items={[
                  { label: 'Ver perfil',     onClick: () => { toast({ message: 'Ver perfil', variant: 'info' }); if (!dropdownDone) { setDropdownDone(true); checkAllDone(toastCount, modalConfirmed, tooltipDone, true) } } },
                  { label: 'Configuración',  onClick: () => toast({ message: 'Configuración', variant: 'info' }) },
                  { label: 'Cerrar sesión',  onClick: () => toast({ message: 'Cerrando sesión', variant: 'warning' }), variant: 'danger' },
                ]}
              />
              {dropdownDone && <Weld.Text variant="muted" style={{ fontSize: 12, color: '#22c55e' }}>✓ Dropdown explorado</Weld.Text>}
            </Weld.Stack>
          </Weld.Card>
        </Weld.Grid>
      </Weld.Stack>

      {/* Resultado final */}
      {allDone && (
        <Weld.Alert variant="success">
          🎉 <strong>¡Completaste el paso 4!</strong> Dominás todos los componentes de feedback y overlay de WELD.
        </Weld.Alert>
      )}

    </Weld.Stack>
  )
}
