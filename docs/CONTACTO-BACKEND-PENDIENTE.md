# Contacto: backend confirmado y CORS activado

## Estado actual

Se actualizó la implementación web existente a **versión 5**, conservando URL/ID, cuenta ejecutora `dr.ejsamudio@gmail.com`, acceso «Cualquier usuario», planilla y hoja `Intakes`. No se crearon endpoints ni se alteraron las asociaciones de Analytics o Search Console.

El backend devuelve `{ "ok": true, "confirmed": true }` únicamente después de persistir y ejecutar `SpreadsheetApp.flush()`. Valida el payload, toma un bloqueo y deduplica por `submissionId` en la nueva columna O, `Submission ID`. Conserva A:M y deja N («Primer contacto») para uso manual. No se corrigieron ni reordenaron los encabezados históricos (la hoja ya tenía el texto de varios encabezados agrupado en A1). La notificación VERDE se conserva, pero un fallo de correo no convierte un guardado en rechazo.

## Prueba real del backend

Desde `https://consumidormisiones.com.ar/`, con POST `text/plain;charset=UTF-8` y `mode: cors`:

- Payload inválido: HTTP 200, respuesta `cors`, JSON `ok:false, confirmed:false, error:invalid_nombre`.
- Payload sintético `cue-e2e-20261021-0256`: HTTP 200, respuesta `cors`, JSON `ok:true, confirmed:true, duplicate:false`.
- Fila verificada en `Intakes!O27`, buscador de Sheets «1 de 1».
- Reenvío idéntico: HTTP 200 y `duplicate:true`; mismo ID presente una sola vez.
- Datos de prueba marcados **NO CONTACTAR**, sin persona real.

Frontend actualizado en main mediante commit `812af41f34dfc5f5e4744d3195b7c9aeddef28e9`: `sheetsResponseMode: 'cors'`. El webhook y los IDs de medición se conservan. Publicación comprobada en el dominio real. Recorrido íntegro del formulario: backend HTTP 200, mensaje «Tu evaluación fue registrada», ID `48944821-c94e-48de-b6e3-a1221e0219b8` persistido en `Intakes!O28` y encontrado una sola vez. El frontend emitió exactamente un `contacto_intento` y un `contacto_confirmado`; Analytics Estani (548273838) recibió ambos, con recuento 1, en Resumen en tiempo real. No se abrieron ni enviaron mensajes de WhatsApp/email. La fila sintética está marcada «PRUEBA CUE FORMULARIO V5 20261021 NO CONTACTAR».

## Conversión en Analytics

`contacto_confirmado` se registró como evento clave (crear con código, ya emitido por el frontend), sin valor monetario y una vez por evento. `dictamen_view` se desmarcó como evento clave y se conserva como evento normal: ver un dictamen no prueba que exista un contacto persistido. `purchase` predeterminado se dejó intacto. No se crearon reglas sin código, conversiones de Google Ads ni vinculaciones nuevas. La tabla administrativa puede tardar en mostrar el flujo aunque el evento ya conste en tiempo real. Los datos históricos no se borran.

## Código y pruebas

Código preparado y desplegado: `docs/apps-script-contacto-produccion.gs` (el editor web puede normalizar indentación). Pruebas: `node --test tests/contact-submit.test.cjs tests/apps-script-contacto.test.cjs`, **17/17 aprobadas**. Las pruebas unitarias no sustituyen las comprobaciones reales anteriores.

Capturas locales: `/workspace/contacto-evidencia/backend-v5-publicado.png`, `/workspace/contacto-evidencia/sheets-fila27-id-unico.png`, `/workspace/contacto-evidencia/frontend-commit-cors.png`.

## Reversión

Si es necesario, editar **esa misma implementación** y seleccionar su versión 2 anterior, sin cambiar URL, permisos ni cuenta. Revertir el frontend a `no-cors` para no afirmar confirmación. No borrar las filas ni los IDs de prueba o producción. No modificar las otras implementaciones activas v3/v4.

---

## Antecedentes históricos (anteriores al cierre; no describen el estado actual)

# Contacto: estado de confirmación y backend pendiente

## Comportamiento preparado en frontend

- Se conserva **la URL webhook que ya estaba configurada** y el modo activo sigue siendo `no-cors`. No se cambia a una URL de ejemplo ni se da por desplegado el código de este directorio.
- Una respuesta `opaque` de `no-cors` no prueba si Apps Script guardó una fila. En ese modo el frontend muestra que el registro **no puede confirmarse**, no emite `contacto_confirmado` ni `generate_lead`, y registra solo `contacto_intento` más `contacto_no_confirmado` o `contacto_falla`.
- Se considera `contacto_falla` solo un rechazo explícito HTTP/backend. Timeout y errores de red/CORS quedan como `contacto_no_confirmado`: el POST pudo haber llegado y la respuesta haberse perdido.
- Para evitar crear duplicados por reenvíos ambiguos, el intento queda marcado en `sessionStorage` sin guardar PII adicional; no se vuelve a enviar el mismo borrador en esa pestaña. Editar un campo o reiniciar constituye un borrador nuevo. El `submissionId` enviado no contiene datos personales.
- El modo `cors` existe como opt-in de código, pero permanece desactivado. Solo una respuesta CORS legible con JSON `{ "ok": true, "confirmed": true }` puede habilitar el mensaje de registro confirmado. El backend debe emitir ese JSON únicamente después de persistir.

## Evidencia y limitaciones conocidas

- En una prueba de producción reciente se validó que el nombre vacío detiene el formulario; un recorrido completo mostró el dictamen VERDE y el mensaje antiguo de “registrado”, aunque `fetch` tuvo `responseStatus 0` y respuesta opaca. **Eso no demuestra que exista una fila en Sheets.**
- La URL configurada sí corresponde al proyecto de Apps Script encontrado: en Gestionar implementaciones está vinculada a la implementación web `Sin título`, versión 2 (29 de julio de 2026, 1:04), ejecutada como `dr.ejsamudio@gmail.com` y con acceso “Cualquier usuario”. GET respondió `OK - Estudio Samudio` según la comprobación reportada, pero eso no prueba el `doPost` ni el append.
- El editor contiene una versión más nueva (v4) asociada a `intakes`, con código que usa la hoja `Intakes` y los encabezados Fecha, Vertical, Nivel, Nombre, Localidad, Teléfono, Email, Consumo, Problema, Prueba, Monto, Situacion, Origen y Primer contacto. **No está confirmado que el código de la implementación desplegada v2 sea igual al código más nuevo.** No se modificó ninguna implementación.
- No se modificó el proyecto Apps Script vivo. Cualquier actualización futura debe editar la implementación existente manteniendo la URL/ID, usuario de ejecución, permisos, planilla y columnas actuales; no crear otro endpoint ni sustituir URL. El ejemplo `docs/apps-script-contacto-ejemplo.gs` es una propuesta: valida campos, toma un `LockService`, busca `submissionId` en la columna O, añade la fila y ejecuta `SpreadsheetApp.flush()` antes de devolver `confirmed:true`. Requiere configurar `SPREADSHEET_ID` y agregar el encabezado `Submission ID` al final de la hoja `Intakes`.
- Devolver JSON desde Apps Script no garantiza por sí solo que una página de otro origen pueda leer la respuesta con `fetch` en modo CORS. Antes de cambiar `sheetsResponseMode` a `cors`, hay que desplegar/configurar una respuesta realmente legible desde el dominio del sitio y comprobar en navegador el POST, el código HTTP, el JSON y la fila persistida. Si Apps Script no ofrece un canal CORS adecuado, hará falta un intermediario con CORS; no se debe volver a inferir éxito desde `no-cors`.

## Pruebas locales

Ejecutar `node --test tests/contact-submit.test.cjs`. Las pruebas ejercitan confirmación explícita, error HTTP, respuesta opaca, no-cors con respuesta simulada legible, respuesta sin confirmación, error de red y timeout. Son pruebas del clasificador frontend, no una prueba del Apps Script productivo ni de conectividad CORS real.

## Acceso a Search Console: conservar la vinculación existente

**Resuelto:** la cuenta `dr.ejsamudio@gmail.com` ya puede abrir la propiedad de dominio `consumidormisiones.com.ar`. En Ajustes → Verificación de la propiedad, Google muestra «Propietario verificado» y «Proveedor de nombres de dominio: Se ha verificado correctamente». Se comprobó después de pulsar «Verificar la propiedad» y recargar la página. No hizo falta entrar a Cloudflare ni añadir, sustituir o eliminar registros DNS: el TXT de verificación ya estaba publicado.

Analytics «Estani» (548273838) sigue asociado a esa propiedad de dominio mediante el flujo «consumo» (15373028859). No se duplicó ni sustituyó el enlace. Search Console también muestra «Asociaciones: Google Analytics» en los ajustes del dominio.

Acceso directo: https://search.google.com/search-console?resource_id=sc-domain%3Aconsumidormisiones.com.ar

Captura de confirmación: `/workspace/contacto-evidencia/search-console-dominio-verificado.png`.

La corrección del formulario sigue preparada, no desplegada. La verificación de Search Console no resuelve la respuesta opaca ni confirma por sí sola la persistencia de contactos. Cualquier despliegue en el sitio o actualización de la implementación Apps Script requiere aprobación específica y debe conservar la URL existente.

Fuente: [Ayuda oficial de Google: verificar la propiedad y solicitar acceso a otro propietario](https://support.google.com/webmasters/answer/9008080?hl=es).
