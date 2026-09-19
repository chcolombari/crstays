# Host Consulting 2.0 — HC-2 · Candidato para revisión

Fecha: 19 de septiembre de 2026. No se publicó, desplegó, fusionó ni envió ninguna rama remota.

## Alcance y bases

Frontend: HC-1 aprobado (`741cbd4a017e8aaa4ff7432029f0fc57ddda817a`), sobre el sitio estático existente. Backend: `origin/main` de Phase 5F (`4b094c5`). Ambos conservan su arquitectura; no se modifica el cálculo del Analyzer ni sus secuencias de seguimiento. Los archivos completos de ambos repositorios acompañan la entrega, incluidos los que no cambiaron.

Se incorporaron la política Diagnostic de 24 horas, la referencia discreta a ASOHOST como miembro constituyente y de Junta Directiva, y la descripción de Launch Pro como acompañamiento intensivo durante el lanzamiento, con equivalencia ES/EN. Se mantienen colores, tipografías, esquinas rectas y navegación de HC-1.

## Recorridos y navegación

| Plan | Recorrido acordado | HC-2 |
|---|---|---|
| Diagnostic Session | Pago → intake → Calendly | Intake y API preparados y protegidos. No hay CTA público que omita el pago. |
| Host Starter | Intake → pago → Calendly | CTAs de detalle abren el intake bilingüe real. Confirmación indica que el pago sigue pendiente. |
| Launch Pro | Solicitud → Intro Call → evaluación → pago | CTAs abren la solicitud real. La confirmación describe el siguiente paso sin afirmar que exista una cita. |
| Growth Advisory | Solicitud → Intro Call → evaluación → pago/onboarding | Solicitud para propiedades no publicadas, próximas a publicar, activas o en relanzamiento. |

Páginas reutilizables: `/host-consulting/intake.html?plan=host-starter` y `/En/host-consulting/intake.html?plan=host-starter`. Valores de URL: `diagnostic-session`, `host-starter`, `launch-pro`, `growth-advisory`. El enlace de idioma conserva el plan. Las páginas de intake usan `noindex,nofollow` y `no-referrer`.

Los CTAs de pago de Diagnostic y de llamada conservan una alternativa por correo mientras esos flujos no existan. No hay checkout, integración Calendly, cobros ni agenda en HC-2. El usuario ve una confirmación únicamente después de que la API confirme la persistencia.

## Formularios y contrato compartido

`assets/consulting-form-schema.json` (sitio) y `consulting-form.schema.json` (backend) deben mantenerse idénticos. El contrato contiene las etiquetas ES/EN, opciones legibles, condiciones, límites y obligatoriedad de los 48 campos; es la referencia completa de campos requeridos y opcionales.

La primera pregunta determina la etapa de la propiedad: no publicada, preparando publicación, activa o relanzamiento. Nombre, correo, teléfono, ubicación y tipo de propiedad son comunes. En propiedades activas/relaunch se pregunta primero si existe anuncio Airbnb: se exige URL Airbnb solamente si la respuesta es sí. El enlace secundario siempre es opcional. También se aceptan propiedades activas en otras plataformas sin Airbnb.

- Diagnostic: fecha de inicio, etapa, objetivo, expectativas y problema prioritario opcional.
- Host Starter: fecha de lanzamiento, etapa, preparación, pendientes, reto principal, objetivo de 30 días y expectativas.
- Launch Pro: fecha, objetivo de 60 días, operador, disponibilidad, expectativas, motivo y retos específicos de pre-lanzamiento o de operación/relaunch.
- Growth pre-lanzamiento: fecha estimada, plataformas previstas, preparación, pendientes, enfoque de precios y objetivo de tres meses.
- Growth activo: plataformas/anuncio aplicable, inicio de operación, gestor, herramientas, PMS, uso de PriceLabs, método de precios, objetivo, reto, acceso y objetivo de tres meses. Ocupación, ADR, ingreso mensual y problemas de reseñas son opcionales; el valor cero es válido.
- Growth relanzamiento: información operativa anterior más cambios deseados y objetivo del relanzamiento.

La etapa específica de Diagnostic/Starter se deriva de la pregunta inicial para evitar respuestas contradictorias. Cambiar de rama elimina y deshabilita los campos que dejan de aplicar. Las selecciones Airbnb/plataformas y herramientas/PriceLabs deben ser coherentes. El servidor vuelve a validar todo; no confía en la validación del navegador.

## API, seguridad y persistencia

`POST /api/consulting-leads`, JSON, máximo 32 KiB. Claves base: `full_name`, `email`, `phone`, `property_location`, `property_type`, `listing_status`, `airbnb_url`, `secondary_listing_url`, `plan`, `language`, `source`, `form_data`, más `submission_id` UUID4. Diagnostic requiere además `intake_token`. Los IDs de plan usan guiones bajos; `source` es `host_consulting_` seguido del ID. El servidor controla estados y notificaciones.

Secuencia: validar y normalizar → INSERT → COMMIT → notificación interna Brevo → UPDATE de notificación en otra transacción. Una excepción de Brevo produce `notification_status=failed` y conserva respuesta HTTP 201 `{"status":"received"}`. Si falla la actualización del estado de notificación, el lead ya existe y permanece pendiente; también se responde 201. Si falla la persistencia, se responde 503 sin enviar correo.

El mismo UUID y contenido normalizado retornan 201 sin insertar ni notificar otra vez. Mismo UUID con datos diferentes retorna 409. La restricción única resuelve también solicitudes simultáneas. El navegador guarda exclusivamente el UUID por plan en `sessionStorage`, nunca las respuestas o el token. Reintentar luego de perder la respuesta usa el mismo UUID; no crea un nuevo lead. Un nuevo envío distinto en esa misma sesión debe revisarse por correo cuando se recibe 409.

No existe reenvío automático de notificaciones fallidas o pendientes. Una interrupción después del COMMIT y antes del envío puede dejar la notificación pendiente; el lead permanece. Operaciones debe revisar los estados `failed` y `pending` y confirmar si Brevo aceptó el mensaje antes de reenviar, para evitar duplicaciones ante respuestas ambiguas del proveedor.

Se rechazan campos desconocidos, enumeraciones inválidas, datos ocultos de otras ramas, URLs no HTTP(S), credenciales en URLs, hosts locales/IP y formatos inválidos. Las URLs no se consultan. HTML del correo escapado. No se devuelven PII ni identificadores internos en las respuestas; los logs de la nueva ruta contienen categorías de resultado. CORS reutiliza la lista de orígenes permitidos existente y el limitador es independiente del intake de Property Management.

## Supabase y configuración posterior a aprobación

Migración nueva: `migrations/004_consulting_leads.sql`. Crea `public.consulting_leads`, índices, restricciones, trigger `updated_at`, campos base solicitados, JSONB y tres campos internos de idempotencia/autorización. Activa RLS, revoca acceso directo a PUBLIC/anon/authenticated y permite uso del propietario/rol privilegiado de backend. No incluye políticas públicas ni claves en el navegador. El adaptador usa la conexión PostgreSQL privilegiada existente, sin llamadas directas del frontend a Supabase.

Estados admitidos: `intake_completed`, `application_submitted`, `intro_call_scheduled`, `fit_confirmed`, `payment_pending`, `paid`, `session_scheduled`, `onboarding`, `active`, `completed`, `not_a_fit`, `lost`. Diagnostic y Starter empiezan en `intake_completed`; Launch y Growth en `application_submitted`. No se incluye panel administrativo ni API pública para cambiar estos estados.

Después de aprobación, en un entorno de revisión/staging: aplicar migración con el propietario privilegiado; conservar `PPA_STORAGE=postgres`, `DATABASE_URL`, configuración Brevo y lista CORS existentes; configurar `CONSULTING_NOTIFICATION_EMAIL` con el destinatario interno aprobado. No se configura un destinatario por defecto para evitar envíos accidentales. `assets/consulting-config.js` contiene sólo la dirección pública de API y puede apuntarse al entorno aprobado. El frontend se prueba antes de publicarse, coordinado con la disponibilidad de la nueva ruta.

`CONSULTING_INTAKE_SECRET` permanece vacío por defecto: Diagnostic queda cerrado. La función privada `issue_diagnostic_authorization` es un punto de integración para una fase futura que verifique primero el pago. No hay endpoint que emita tokens ni verificación de Tilopay/PayPal en HC-2. La futura integración deberá usar secreto de al menos 32 caracteres, referencia opaca y vencimiento máximo de 30 días; entregar el token por fragmento `#intake_token=...`, nunca por query. El navegador retira el fragmento inmediatamente y no lo persiste. La API verifica HMAC, plan y vencimiento. La referencia de pago se almacena sólo como hash único, permitiendo un intake por referencia incluso si se reemite el token. El token no es por sí mismo una verificación contra el proveedor de pagos; su emisor futuro tiene esa responsabilidad.

No se aplicó esta migración al Supabase alojado, no se cambiaron variables remotas y no se envió correo real. En vista previa localhost, el formulario bloquea solicitudes a la API remota; para probar envíos debe utilizarse el servidor QA local o un staging expresamente configurado. Esta restricción evita que revisar el formulario genere leads reales.

## Pruebas reproducibles

Backend (dependencias de producción exactas en `requirements.lock`):

```sh
python -m unittest test_hc2 -v
python -m unittest test_phase5e test_phase5f -v
python gen_manifest.py
python verify_release.py
./clean_room_test.sh
```

El clean room existente requiere CPython 3.12/macOS ARM64 para usar los wheels offline y ahora incluye HC-2. No demuestra despliegue ni disponibilidad del servicio alojado.

QA PostgreSQL, en un entorno virtual separado: instalar `pgserver==0.1.4` además del lock, luego `python -m unittest test_hc2_postgres.PostgresTests -v`. Usa PostgreSQL 16.2 desechable y prueba commits observables desde otra conexión, fallo de Brevo, concurrencia, RLS/roles y estados. No apunta a la base de producción.

Frontend: Playwright/Chrome disponibles; ejecutar `tests/test_hc1_browser.cjs`, `tests/test_phase5f_browser.cjs` y `tests/test_hc2_browser.cjs`. El último requiere `HC2_BACKEND_ROOT`, `HC2_PYTHON` (venv con pgserver) y `HC2_QA_OUTPUT` (carpeta de evidencia). Inicia `qa_hc2_server.py --qa-only` en loopback, PostgreSQL temporal y Brevo simulado. Este servidor QA no es un entrypoint de despliegue y nunca debe publicarse.

La entrega incluye resultados completos en `HC2-QA.json`: 64 recorridos ES/EN, escritorio/móvil, cuatro planes y cuatro etapas contra API y PostgreSQL reales locales; accesibilidad automatizada en 16 combinaciones; regresiones de HC-1 y Phase 5F. Brevo se simula para probar éxito/fallo sin enviar mensajes. Supabase alojado/PostgREST y la entrega efectiva del correo requieren prueba posterior en el entorno aprobado. La revisión axe es evidencia automatizada, no una certificación integral de accesibilidad.
