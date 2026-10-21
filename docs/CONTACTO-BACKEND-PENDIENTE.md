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

Analytics «Estani» (548273838) ya está asociado a la propiedad de dominio `consumidormisiones.com.ar` mediante el flujo «consumo» (15373028859). No duplicar ni sustituir este enlace. La cuenta `dr.ejsamudio@gmail.com` sí tiene acceso como propietario verificado a `https://consumidormisiones.com.ar/`, pero al abrir la propiedad de dominio recibe un aviso de falta de acceso.

1. Iniciar sesión con una cuenta que sea propietaria de la propiedad **de dominio** `consumidormisiones.com.ar` en Search Console.
2. Seleccionar esa propiedad, no la de prefijo HTTPS. Ir a **Ajustes → Usuarios y permisos → Añadir usuario** y conceder a `dr.ejsamudio@gmail.com` acceso completo. Si necesita administrar propietarios, el propietario verificado debe otorgarle además el rol de propietario delegado desde la gestión de permisos.
3. Si no se dispone de una cuenta propietaria, abrir la propiedad de dominio con `dr.ejsamudio@gmail.com` y pulsar **Verificar la propiedad**. Copiar el registro TXT que Google muestre y añadirlo en el proveedor DNS del dominio; no sustituir otros registros ni tokens de verificación.
4. Volver a Search Console y pulsar **Verificar** cuando el TXT sea visible. Conservar ese registro después de verificar. Esta vía requiere acceso al proveedor DNS; no basta con la etiqueta de Analytics ni con ser propietario del prefijo HTTPS.
5. Confirmar que se puede abrir la propiedad de dominio. No tocar la asociación existente en Analytics.

Fuente: [Ayuda oficial de Google: verificar la propiedad y solicitar acceso a otro propietario](https://support.google.com/webmasters/answer/9008080?hl=es).
