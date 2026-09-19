# HC-2.1 — Limpieza puntual de formularios

Se parte de HC-2 Complete: frontend `3361d260737eef24ac04bcf22f9d72536c840e0f` y backend `62739242c59e854149c148f27337a0daff7a750b`. No se inicia HC3 ni se conectan servicios reales.

## Contrato versión 2

- Se eliminan `property_stage` y `project_stage` del schema, del código de derivación y del payload. `listing_status` es la única fuente de estado. La API rechaza ambas claves antiguas tanto en el nivel raíz como dentro de `form_data`, incluso vacías o coincidentes. No hay aliases ni conversión implícita.
- Diagnostic conserva `expectations` como clave y textarea obligatorio. La etiqueta es exactamente “¿Qué te gustaría tener más claro al terminar esta sesión?” / “What would you like to have clearer by the end of this session?”. La excepción de etiqueta por plan también se aplica al correo interno; las etiquetas de los otros planes permanecen iguales.
- Host Starter `primary_challenge` es un select obligatorio: `property_preparation`, `listing`, `pricing`, `operations`, `first_bookings`, `reviews`, `tools_automation`, `other`. Las etiquetas ES/EN son las solicitadas. Se guarda en `form_data.primary_challenge`.
- `primary_challenge_other`: textarea de hasta 1.000 caracteres, obligatorio y visible únicamente cuando el reto es `other`. Se guarda por separado en `form_data`. Cambiar la opción borra y deshabilita el texto anterior. El backend rechaza texto no vacío fuera de esa condición. El correo usa la etiqueta legible y el detalle.
- Growth pre-launch `what_is_ready`: lista de checkboxes con `furnished_equipped`, `photos`, `airbnb`, `booking`, `initial_pricing`, `rules`, `messaging`, `cleaning`, `check_in`, `tools_software`. Se conserva la obligatoriedad anterior: al menos una selección. Se guarda como array de valores canónicos, ordenado por el normalizador para mantener idempotencia. No se aceptan strings, valores desconocidos ni duplicados. `what_is_missing` sigue abierto. Se conserva la condición `not_published`/`preparing`; activo y relaunch no cambian.

Los dos schemas, frontend y backend, son idénticos y contienen 47 campos. El cambio de versión expresa que las formas antiguas del payload ya no son válidas. Publicar frontend y backend deberá coordinarse en una fase autorizada. No se realiza migración de datos históricos: los datos de planes viven en JSONB, no se agregan columnas y no se alteran RLS ni permisos. No hay base alojada conectada durante esta entrega.

## Preservado

Idempotencia, COMMIT previo a Brevo, retención del lead ante fallos, gate Diagnostic, CORS, RLS, aislamiento Analyzer/PPA, rutas, planes y condiciones de las demás ramas. No se cambian precios, diseño comercial, checkout ni agenda.

## QA

Se amplían `test_hc2.py` y `tests/test_hc2_browser.cjs`. Las pruebas cubren rechazo estricto de las claves eliminadas, todas las opciones Starter, Other vacío/completo/cambiado, etiquetas Diagnostic, listas Growth válidas e inválidas, traducción del correo y persistencia real local. Se repiten los 64 recorridos originales y se agregan 36 recorridos estructurados (32 Starter y 4 Growth) en ES/EN y anchos 390/1280. Los tests PostgreSQL originales vuelven a correr contra el contrato nuevo. Ver HC2.1-QA.json y evidencias de la entrega para resultados efectivos.

Reproducción: mismos comandos y dependencias documentados en HC2-Host-Consulting.md. Brevo se simula y PostgreSQL es desechable; no se envían mensajes reales ni se modifican Supabase/Render. Sin push, merge ni deploy.
