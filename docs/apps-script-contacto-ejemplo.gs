/*
 * Ejemplo de endpoint para la hoja de contactos.
 * Propuesta no desplegada. Configuración: definir SPREADSHEET_ID y usar la hoja
 * "Intakes" existente. Agregar al final de los encabezados actuales una columna
 * O llamada "Submission ID" para poder deduplicar sin reordenar las columnas.
 * No reemplazar la implementación activa sin identificarla y probarla.
 */
const CONTACT_SHEET_NAME = 'Intakes';
const SUBMISSION_ID_COLUMN = 15;

function doPost(e) {
  try {
    const payload = JSON.parse(e && e.postData && e.postData.contents || '{}');
    const invalid = validateContact_(payload);
    if (invalid) return jsonResponse_({ ok: false, confirmed: false, error: invalid });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = openContactSheet_();
      const existingRow = findSubmission_(sheet, payload.submissionId);
      if (existingRow) {
        return jsonResponse_({ ok: true, confirmed: true, duplicate: true });
      }

      sheet.appendRow([
        payload.fecha,
        payload.vertical,
        payload.nivel,
        payload.nombre,
        payload.localidad,
        payload.telefono,
        payload.email,
        payload.consumo,
        payload.problema,
        payload.prueba,
        payload.monto,
        payload.situacion,
        payload.origen,
        '',
        payload.submissionId
      ]);
      SpreadsheetApp.flush();
      // La respuesta confirmada se construye solo después de que appendRow y
      // flush finalizaron sin lanzar error.
      return jsonResponse_({ ok: true, confirmed: true, duplicate: false });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    console.error('No se pudo persistir el contacto: ' + String(err));
    return jsonResponse_({ ok: false, confirmed: false, error: 'save_failed' });
  }
}

function validateContact_(p) {
  if (!p || typeof p !== 'object' || Array.isArray(p)) return 'invalid_payload';
  if (typeof p.submissionId !== 'string' || !/^[A-Za-z0-9-]{16,80}$/.test(p.submissionId)) return 'invalid_submission_id';
  const required = ['nombre', 'telefono', 'vertical', 'nivel'];
  for (const key of required) {
    if (typeof p[key] !== 'string' || !p[key].trim() || p[key].length > 200) return 'invalid_' + key;
  }
  const strings = ['fecha', 'localidad', 'email', 'situacion', 'origen'];
  for (const key of strings) {
    if (p[key] !== undefined && (typeof p[key] !== 'string' || p[key].length > 5000)) return 'invalid_' + key;
  }
  const scores = ['consumo', 'problema', 'prueba', 'monto'];
  for (const key of scores) {
    if (p[key] !== undefined && p[key] !== null && !Number.isFinite(Number(p[key]))) return 'invalid_' + key;
  }
  if (!['VERDE', 'AMARILLO', 'ROJO'].includes(p.nivel)) return 'invalid_nivel';
  return '';
}

function openContactSheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('Falta configurar SPREADSHEET_ID');
  const sheet = SpreadsheetApp.openById(id).getSheetByName(CONTACT_SHEET_NAME);
  if (!sheet) throw new Error('No existe la hoja ' + CONTACT_SHEET_NAME);
  return sheet;
}

function findSubmission_(sheet, submissionId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;
  const match = sheet.getRange(2, SUBMISSION_ID_COLUMN, lastRow - 1, 1)
    .createTextFinder(submissionId)
    .matchEntireCell(true)
    .findNext();
  return match ? match.getRow() : 0;
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
