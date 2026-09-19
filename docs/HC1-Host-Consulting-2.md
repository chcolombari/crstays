# Host Consulting 2.0 — HC-1

Implementación visual, comercial y de navegación para revisión. Base: `chcolombari/crstays`, `main` en `0b5a29a` (verificada el 19 de septiembre de 2026). Rama de trabajo: `hc1-host-consulting-2`.

## Alcance entregado

- Rediseño de las dos páginas principales con las 14 secciones, en el orden acordado.
- Ocho páginas de detalle: los cuatro planes en español e inglés.
- Marca existente: Forest `#1A3D2B`, Forest Dark `#122B1E`, Gold `#FABC3D`, Gold Dark `#C9963A`, Ivory `#FAF7F0`, Charcoal `#3E3E3E`; Hammersmith One y Montserrat; esquinas rectas y acciones principales doradas. Sin emojis de interfaz.
- Navegación y footer basados en el sitio actual, con menú móvil accesible, cambio ES/EN a la página equivalente, enlace para saltar al contenido y navegación sin JavaScript.
- Títulos, descripciones, canonical, hreflang, Open Graph, Twitter y datos estructurados Service. Las diez rutas se agregan al sitemap existente.

Se conserva la arquitectura de HTML estático: no hay framework, build, dependencia nueva ni generación de contenido en el navegador. Las diez páginas comparten un CSS y un JavaScript pequeño para el menú móvil. El contenido se puede editar directamente en cada HTML.

## Archivos

Modificados:

- `host-consulting.html`
- `En/host-consulting.html`
- `sitemap.xml`

Nuevos:

- `host-consulting/diagnostic-session.html`
- `host-consulting/host-starter.html`
- `host-consulting/launch-pro.html`
- `host-consulting/growth-advisory.html`
- `En/host-consulting/diagnostic-session.html`
- `En/host-consulting/host-starter.html`
- `En/host-consulting/launch-pro.html`
- `En/host-consulting/growth-advisory.html`
- `assets/host-consulting.css`
- `assets/host-consulting.js`
- `tests/test_hc1_browser.cjs`
- `docs/HC1-Host-Consulting-2.md`

## Decisiones visuales

1. Se reutilizan logo, fotografía local del sitio, tipografías, paleta y contenido de navegación/footer. El hero combina la propuesta comercial con las cuatro etapas; la imagen local evita otra dependencia visual externa.
2. Las seis tarjetas de público objetivo son legibles sin hover: 3×2 en escritorio y una columna en móvil. Los cuatro pilares usan 2×2, luego una columna.
3. Forest separa el bloque de obstáculos; Ivory y blanco alternan las secciones largas. Launch Pro tiene el énfasis de «Más completo».
4. La comparación conserva una tabla semántica, desplazable horizontalmente dentro de su propio contenedor en móvil. La página no tiene desbordamiento horizontal.
5. Los diez documentos del kit tienen nombre y descripción; aparecen en la principal y en los detalles de Host Starter y Launch Pro. Son descripciones comerciales: HC-1 no crea ni publica los documentos del kit.

## Decisiones comerciales y navegación

- Diagnostic: $175, una propiedad, 90 minutos, resumen posterior; reprogramación con 24 horas de anticipación según la conversación acordada.
- Host Starter: $450, 30 días desde la primera sesión, 90 + 60 minutos, kit y cierre. Se eligió «sin soporte continuo por WhatsApp» dentro de la alternativa «limited / none» del blueprint, para no prometer acceso indefinido. Las dudas se revisan en las sesiones incluidas.
- Launch Pro: $950, 60 días, cuatro sesiones / 4,5 horas, kit, roadmap y seguimiento. WhatsApp para consultas breves, respuesta habitual dentro de un día hábil, sin operación ni soporte 24/7.
- Growth Advisory: $350/mes, mínimo tres meses, sesión mensual de 60 minutos, revenue management, listing optimization y reporte mensual. Principalmente para propiedades activas, con evaluación de pre-lanzamiento o relanzamiento. Implementación e integraciones sujetas a acceso y compatibilidad.
- La propuesta de aviso de cancelación de Growth de 30 días aparecía como ejemplo, no como política cerrada. No se convierte en una condición definitiva: se remite al acuerdo de servicio.
- El entregable Diagnostic se describe como resumen de hallazgos y próximos pasos, sin prometer un reporte automatizado todavía no implementado.
- Todas las cards llevan al detalle del plan. En los detalles, el CTA comercial lleva a `#next-steps`, que explica el estado de disponibilidad y ofrece el correo existente. No confirma reservas ni cobra.
- La llamada introductoria tiene una sección propia de 15 minutos, gratuita y de orientación. El CTA permite consultar por correo. No se crea una página adicional de agenda fuera de las diez rutas solicitadas.
- WhatsApp permanece como contacto secundario del footer, con mensaje localizado. Se elimina el enlace de Instagram vacío del footer de estas páginas.

## Límites de HC-1

No se implementan formularios, Supabase, checkout, Calendly, Brevo ni automatizaciones. No se cambia `crstays-ppa`: todo el alcance solicitado pertenece al repositorio web. Tampoco se modifica el código del Analyzer, las páginas principales del sitio ni sus formularios existentes.

La analítica existente se conserva en las dos principales de Host Consulting. No se amplía la instrumentación a los nuevos detalles, porque el script actual clasifica otras rutas como consultas de la home. La ampliación de medición comercial corresponde a una fase posterior.

Los botones de reserva/solicitud se presentan con una nota visible de que los flujos en línea aún no están disponibles. Correo es el puente temporal para HC-1, sin mensajes enviados automáticamente. No hay merge ni despliegue de producción en esta entrega.

## Validación

La prueba `tests/test_hc1_browser.cjs` verifica las diez páginas en Chrome a 320, 360, 390, 768, 1024 y 1440 px: navegación, destinos locales y fragmentos, cambio real de idioma, menú móvil, FAQ, CTAs, tamaños táctiles, metadatos, ausencia de formularios y llamadas a servicios fuera de alcance, errores de página y desbordamiento. También verifica las diez páginas con JavaScript desactivado. Se generan capturas ES/EN en móvil y escritorio.

Resultado final: **4.038 comprobaciones aprobadas**, 60 combinaciones de página y tamaño, fuentes de marca cargadas, sin errores de JavaScript, destinos locales rotos ni desbordamiento horizontal. Revisión visual de capturas del hero, tarjetas de público objetivo, planes y páginas detalle en escritorio y móvil.

Se ejecutaron además las suites existentes `test_phase5d.py` y `test_phase5e.py` (40 pruebas) y `test_phase5f_browser.cjs` (74 comprobaciones). La última compara las homepages existentes con su base y conserva su comportamiento; HC-1 no corrige problemas anteriores de esas páginas fuera de alcance.

Para revisión local desde la raíz del repositorio:

```sh
python3 -m http.server 8080
```

Abrir `http://localhost:8080/host-consulting.html` o `http://localhost:8080/En/host-consulting.html`. Servir por HTTP conserva las rutas absolutas del sitio. No abrir los HTML directamente como archivos locales.

Para la prueba de HC-1, usar un entorno con Playwright instalado y Chrome disponible:

```sh
node tests/test_hc1_browser.cjs
```

`NODE_PATH` puede apuntar a una instalación existente de Playwright. `CHROME_PATH` permite indicar otro ejecutable y `HC_QA_OUTPUT` cambia la carpeta de evidencias.
