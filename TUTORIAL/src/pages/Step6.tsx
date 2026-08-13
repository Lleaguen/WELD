import React, { useState, useCallback } from 'react'
import { Weld, toast } from '@weldjs/react'

// ─── Lógica de validación (lo que useForm hace por vos) ───────────────────────

type FormValues = { name: string; email: string; subject: string; message: string }
type FormErrors = Partial<Record<keyof FormValues, string>>

function validate(v: FormValues): FormErrors {
  const e: FormErrors = {}
  if (!v.name.trim() || v.name.trim().length < 2)
    e.name = 'El nombre debe tener al menos 2 caracteres'
  if (!v.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))
    e.email = 'Email inválido (ej: franco@ejemplo.com)'
  if (!v.subject.trim())
    e.subject = 'El asunto es obligatorio'
  if (!v.message.trim() || v.message.trim().length < 20)
    e.message = 'El mensaje debe tener al menos 20 caracteres'
  return e
}

export function Step6() {
  const [values,  setValues]  = useState<FormValues>({ name: '', email: '', subject: '', message: '' })
  const [errors,  setErrors]  = useState<FormErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)

  const initialValues = { name: '', email: '', subject: '', message: '' }
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues)
  const isValid = Object.keys(validate(values)).length === 0

  const set = (field: keyof FormValues) => (val: string) =>
    setValues(prev => ({ ...prev, [field]: val }))

  const blur = (field: keyof FormValues) => () => {
    setTouched(prev => ({ ...prev, [field]: true }))
    setErrors(validate(values))
  }

  const fieldProps = (name: keyof FormValues) => ({
    value:    values[name],
    onChange: set(name),
    onBlur:   blur(name),
    error:    touched[name] ? errors[name] : undefined,
  })

  const handleSubmit = useCallback(async () => {
    const allTouched = { name: true, email: true, subject: true, message: true }
    setTouched(allTouched)
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length > 0) throw new Error('Por favor corregí los errores')

    await new Promise(res => setTimeout(res, 1500))
    setSubmitted(true)
    toast({ message: `¡Mensaje enviado por ${values.name}!`, variant: 'success' })
    setValues(initialValues)
    setTouched({})
    setErrors({})
  }, [values])

  const resetForm = () => {
    setValues(initialValues)
    setTouched({})
    setErrors({})
    setSubmitted(false)
  }

  return (
    <Weld.Stack gap={32}>

      {/* ── Concepto ──────────────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>Formularios</Weld.Badge>
        <Weld.Heading level={2}>Formularios sin boilerplate</Weld.Heading>
        <Weld.Text>
          Un formulario típico necesita: estado de cada campo, validación al blur y al submit,
          mostrar errores por campo, deshabilitar el botón mientras envía, y saber si el usuario
          tocó un campo o no (touched). Con React vanilla eso son 40+ líneas. Con{' '}
          <Weld.Text variant="code" as="span">useForm</Weld.Text> de{' '}
          <Weld.Text variant="code" as="span">@weldjs/forms</Weld.Text> son 10.
        </Weld.Text>
      </Weld.Stack>

      <Weld.Divider />

      {/* ── Conceptos clave ───────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>Conceptos clave</Weld.Badge>
        <Weld.Heading level={3}>Lo que useForm maneja por vos</Weld.Heading>

        <Weld.Stack gap={10}>
          {[
            { term: 'values',       def: 'El estado actual de todos los campos del formulario.' },
            { term: 'errors',       def: 'Los mensajes de error por campo, calculados desde el schema Zod.' },
            { term: 'touched',      def: 'Qué campos tocó el usuario. Los errores solo se muestran en campos touched (para no mostrar errores en campos que el usuario aún no visitó).' },
            { term: 'isDirty',      def: 'true si el usuario modificó algún campo respecto al valor inicial. Útil para mostrar "hay cambios sin guardar".' },
            { term: 'isValid',      def: 'true si no hay errores de validación. Podés usarlo para habilitar/deshabilitar el botón de submit.' },
            { term: 'isSubmitting', def: 'true mientras la promesa del onSubmit está pendiente. El botón se deshabilita automáticamente.' },
            { term: 'register()',   def: 'Registra un campo — devuelve { value, onChange, onBlur, error } listos para pasarle a Weld.Input.' },
          ].map(({ term, def }) => (
            <div key={term} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Weld.Text variant="code" as="span" style={{ minWidth: 130, flexShrink: 0, fontSize: 12 }}>{term}</Weld.Text>
              <Weld.Text variant="muted" style={{ fontSize: 13 }}>{def}</Weld.Text>
            </div>
          ))}
        </Weld.Stack>
      </Weld.Stack>

      <Weld.Divider />

      {/* ── Cómo se usa ───────────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content' }}>Cómo se usa</Weld.Badge>
        <Weld.Heading level={3}>useForm en 3 pasos</Weld.Heading>

        <Weld.Stack gap={10}>
          <Weld.Text style={{ fontWeight: 600, color: '#f4f4f5' }}>Paso 1 — Definí el schema con Zod</Weld.Text>
          <Weld.Card accent>
            <Weld.Text variant="code" as="pre" style={{ fontSize: 12 }}>{`import { z } from 'zod'

const schema = z.object({
  name:    z.string().min(2, 'Mínimo 2 caracteres'),
  email:   z.string().email('Email inválido'),
  message: z.string().min(20, 'Mínimo 20 caracteres'),
})

// El tipo se infiere automáticamente:
type FormValues = z.infer<typeof schema>
// { name: string; email: string; message: string }`}</Weld.Text>
          </Weld.Card>

          <Weld.Text style={{ fontWeight: 600, color: '#f4f4f5' }}>Paso 2 — Configurá useForm</Weld.Text>
          <Weld.Card accent>
            <Weld.Text variant="code" as="pre" style={{ fontSize: 12 }}>{`import { useForm } from '@weldjs/forms'

const form = useForm({
  initialValues: { name: '', email: '', message: '' },
  schema,
  onSubmit: (values) =>
    api.post('contact', ResponseSchema, { body: values }),
    //  ↑ cualquier función que devuelva Promise o WeldResponse
})`}</Weld.Text>
          </Weld.Card>

          <Weld.Text style={{ fontWeight: 600, color: '#f4f4f5' }}>Paso 3 — Conectá los campos con register()</Weld.Text>
          <Weld.Card accent>
            <Weld.Text variant="code" as="pre" style={{ fontSize: 12 }}>{`// form.register('name') devuelve:
// { value, onChange, onBlur, error }
// Exactamente lo que Weld.Input espera

<Weld.Input label="Nombre"    {...form.register('name')} />
<Weld.Input label="Email"     {...form.register('email')} />
<Weld.Input label="Mensaje"   {...form.register('message')} />

// El botón se conecta directamente al submit:
<Weld.Button action={form.handleSubmit}>
  Enviar
</Weld.Button>

// Estados útiles:
{form.isDirty    && <p>Hay cambios sin guardar</p>}
{!form.isValid   && <p>Corregí los errores antes de enviar</p>}`}</Weld.Text>
          </Weld.Card>
        </Weld.Stack>
      </Weld.Stack>

      <Weld.Divider />

      {/* ── Ejercicio ─────────────────────────────────────────────────────── */}
      <Weld.Stack gap={12}>
        <Weld.Badge style={{ width: 'fit-content', background: 'rgba(59,107,255,0.15)', color: '#7c9fff' }}>
          Ejercicio 6 — Formulario completo
        </Weld.Badge>
        <Weld.Heading level={3}>Completá y enviá el formulario</Weld.Heading>
        <Weld.Text>
          Este formulario implementa todo el ciclo que acabás de aprender. Intentá:
        </Weld.Text>
        <Weld.Stack gap={4} style={{ paddingLeft: 16 }}>
          {[
            'Hacer click en Enviar sin completar nada — mirá cómo aparecen los errores en todos los campos',
            'Completar solo el nombre y mover el foco al siguiente campo — aparece el error del email',
            'Escribir un email inválido como "franco" — el error aparece al salir del campo',
            'Completar todo correctamente y enviar — el botón muestra el ciclo loading → success',
          ].map((item, i) => (
            <Weld.Text key={i} variant="muted" style={{ fontSize: 13 }}>
              <span style={{ color: '#3b6bff', marginRight: 8 }}>{i + 1}.</span>{item}
            </Weld.Text>
          ))}
        </Weld.Stack>

        {submitted ? (
          <Weld.Alert variant="success">
            🎉 <strong>¡Formulario enviado!</strong> El botón manejó el loading automáticamente, los valores se resetearon, y el toast apareció sin código extra.
            <div style={{ marginTop: 10 }}>
              <Weld.Button size="sm" variant="secondary" action={() => { resetForm(); return Promise.resolve() }}>
                Probar de nuevo
              </Weld.Button>
            </div>
          </Weld.Alert>
        ) : (
          <Weld.Card>
            <Weld.Stack gap={14}>
              <Weld.Grid cols={2} gap={12}>
                <Weld.Input label="Tu nombre" placeholder="Franco"              {...fieldProps('name')} />
                <Weld.Input label="Tu email"  placeholder="franco@ejemplo.com"  type="email" {...fieldProps('email')} />
              </Weld.Grid>
              <Weld.Input label="Asunto" placeholder="¿Sobre qué escribís?" {...fieldProps('subject')} />
              <Weld.Input label="Mensaje (mínimo 20 caracteres)" placeholder="Contanos qué estás construyendo con WELD..." {...fieldProps('message')} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  {isDirty && (
                    <Weld.Text variant="muted" style={{ fontSize: 12 }}>
                      {isValid
                        ? '✓ Formulario válido — listo para enviar'
                        : 'Hay cambios sin guardar con errores'}
                    </Weld.Text>
                  )}
                </div>
                <Weld.Stack direction="row" gap={8}>
                  {isDirty && (
                    <Weld.Button size="sm" variant="ghost" action={() => { resetForm(); return Promise.resolve() }}>
                      Resetear
                    </Weld.Button>
                  )}
                  <Weld.Button action={handleSubmit}>
                    Enviar mensaje
                  </Weld.Button>
                </Weld.Stack>
              </div>
            </Weld.Stack>
          </Weld.Card>
        )}
      </Weld.Stack>

    </Weld.Stack>
  )
}
