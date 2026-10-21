/* Backend de contacto. Actualizar la implementación existente, nunca crear otra URL. */
const CONTACT_SPREADSHEET_ID = '1ROHekvR8Pck4TqqIUpGt2zS7590hiyaXufXu7tuG9os';
const CONTACT_SHEET_NAME = 'Intakes';
const SUBMISSION_ID_COLUMN = 15;

function doPost(e) {
  try {
    const data = JSON.parse(e && e.postData && e.postData.contents || '{}');
    const invalid = validateContact_(data);
    if (invalid) return jsonResponse_({ok:false, confirmed:false, error:invalid});
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    let duplicate = false;
    try {
      const sheet = SpreadsheetApp.openById(CONTACT_SPREADSHEET_ID).getSheetByName(CONTACT_SHEET_NAME);
      if (!sheet) throw new Error('No existe la hoja Intakes');
      const header = sheet.getRange(1, SUBMISSION_ID_COLUMN).getValue();
      if (!header) {
        const lastRow = sheet.getLastRow();
        if (lastRow > 1 && sheet.getRange(2, SUBMISSION_ID_COLUMN, lastRow - 1, 1).getValues().some(r => r[0] !== '')) {
          throw new Error('Columna O ocupada: revisar sin sobrescribir');
        }
        sheet.getRange(1, SUBMISSION_ID_COLUMN).setValue('Submission ID');
      } else if (header !== 'Submission ID') {
        throw new Error('Encabezado de columna O inesperado');
      }
      const lastRow = sheet.getLastRow();
      const found = lastRow > 1 && sheet.getRange(2, SUBMISSION_ID_COLUMN, lastRow - 1, 1)
        .createTextFinder(data.submissionId).matchEntireCell(true).findNext();
      duplicate = !!found;
      if (!duplicate) {
        const text = value => {
          const s = String(value == null ? '' : value);
          return /^[=+@-]/.test(s) ? "'" + s : s;
        };
        sheet.appendRow([
          text(data.fecha || new Date().toISOString()), text(data.vertical), text(data.nivel),
          text(data.nombre), text(data.localidad), text(data.telefono), text(data.email),
          data.consumo == null ? '' : data.consumo,
          data.problema == null ? '' : data.problema,
          data.prueba == null ? '' : data.prueba,
          data.monto == null ? '' : data.monto,
          text(data.situacion), text(data.origen), '', data.submissionId
        ]);
      }
      SpreadsheetApp.flush();
    } finally {
      lock.releaseLock();
    }
    // El aviso no puede convertir una fila ya persistida en un falso rechazo.
    if (!duplicate && data.nivel === 'VERDE') {
      try {
        MailApp.sendEmail({
          to: Session.getActiveUser().getEmail() || Session.getEffectiveUser().getEmail(),
          subject: 'INTAKE VERDE — ' + data.vertical + ' — ' + data.nombre,
          body: 'Nombre: ' + data.nombre + '\nLocalidad: ' + (data.localidad || '') +
            '\nTeléfono: ' + data.telefono + '\nEmail: ' + (data.email || '') +
            '\nVertical: ' + data.vertical + '\nNivel: ' + data.nivel +
            '\nSituación: ' + (data.situacion || '-') + '\nOrigen: ' + (data.origen || '-') +
            '\nFecha: ' + (data.fecha || '')
        });
      } catch (notificationError) {
        console.error('Contacto persistido; falló el aviso por correo.');
      }
    }
    return jsonResponse_({ok:true, confirmed:true, duplicate:duplicate, submissionId:data.submissionId});
  } catch (err) {
    console.error('No se pudo confirmar la persistencia del contacto.');
    return jsonResponse_({ok:false, confirmed:false, error:'save_failed'});
  }
}

function validateContact_(p) {
  if (!p || typeof p !== 'object' || Array.isArray(p)) return 'invalid_payload';
  if (typeof p.submissionId !== 'string' || !/^[A-Za-z0-9-]{16,80}$/.test(p.submissionId)) return 'invalid_submission_id';
  for (const key of ['nombre','telefono','vertical','nivel']) {
    if (typeof p[key] !== 'string' || !p[key].trim() || p[key].length > 200) return 'invalid_' + key;
  }
  for (const key of ['fecha','localidad','email','situacion','origen']) {
    if (p[key] !== undefined && (typeof p[key] !== 'string' || p[key].length > 5000)) return 'invalid_' + key;
  }
  for (const key of ['consumo','problema','prueba','monto']) {
    if (p[key] !== undefined && p[key] !== null &&
        !((typeof p[key] === 'number' || typeof p[key] === 'string') && Number.isFinite(Number(p[key])))) return 'invalid_' + key;
  }
  if (!['VERDE','AMARILLO','ROJO'].includes(p.nivel)) return 'invalid_nivel';
  return '';
}

function doGet(e) {
  return ContentService.createTextOutput('OK - Estudio Samudio').setMimeType(ContentService.MimeType.TEXT);
}
function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
