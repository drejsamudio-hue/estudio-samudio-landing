const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const sourcePath = path.join(__dirname, '../docs/apps-script-contacto-produccion.gs');
const source = fs.readFileSync(sourcePath, 'utf8');
const validPayload = () => ({
  submissionId: 'contacto-prueba-00000001',
  fecha: '2026-10-20T12:00:00.000Z',
  vertical: 'Bancos',
  nivel: 'VERDE',
  nombre: 'Ada Lovelace',
  localidad: 'Buenos Aires',
  telefono: '1122334455',
  email: 'ada@example.test',
  consumo: 0,
  problema: 0,
  prueba: 0,
  monto: 0,
  situacion: 'Débito no autorizado',
  origen: 'web'
});

function makeHarness({ rows, appendError, flushError, emailError } = {}) {
  const events = [];
  const sheetRows = (rows || [['Fecha', 'Vertical', 'Nivel', 'Nombre', 'Localidad', 'Teléfono', 'Email', 'Consumo', 'Problema', 'Prueba', 'Monto', 'Situación', 'Origen', 'Notas', 'Submission ID']])
    .map(row => [...row]);
  const sheet = {
    getLastRow() {
      let last = sheetRows.length;
      while (last > 0 && sheetRows[last - 1].every(value => value === '' || value == null)) last--;
      return last;
    },
    getRange(row, column, numRows = 1, numColumns = 1) {
      return {
        getValue() { return sheetRows[row - 1]?.[column - 1] ?? ''; },
        setValue(value) {
          events.push(['setValue', row, column, value]);
          while (sheetRows.length < row) sheetRows.push([]);
          while (sheetRows[row - 1].length < column) sheetRows[row - 1].push('');
          sheetRows[row - 1][column - 1] = value;
        },
        getValues() {
          return Array.from({ length: numRows }, (_, offset) =>
            Array.from({ length: numColumns }, (_, colOffset) => sheetRows[row - 1 + offset]?.[column - 1 + colOffset] ?? '')
          );
        },
        createTextFinder(needle) {
          let entireCell = false;
          return {
            matchEntireCell(value) { entireCell = value; return this; },
            findNext() {
              const exists = sheetRows.slice(row - 1, row - 1 + numRows).some(cells => {
                const value = cells[column - 1] ?? '';
                return entireCell ? value === needle : String(value).includes(String(needle));
              });
              return exists ? { found: true } : null;
            }
          };
        }
      };
    },
    appendRow(row) {
      events.push(['appendRow', [...row]]);
      if (appendError) throw new Error('append failed');
      sheetRows.push([...row]);
    }
  };
  const context = {
    console: { error() {} },
    LockService: { getScriptLock: () => ({
      waitLock: ms => events.push(['waitLock', ms]),
      releaseLock: () => events.push(['releaseLock'])
    }) },
    SpreadsheetApp: {
      openById: id => {
        events.push(['openById', id]);
        return { getSheetByName: name => {
          events.push(['getSheetByName', name]);
          return sheet;
        } };
      },
      flush: () => {
        events.push(['flush']);
        if (flushError) throw new Error('flush failed');
      }
    },
    MailApp: { sendEmail: message => {
      events.push(['sendEmail', message]);
      if (emailError) throw new Error('email failed');
    } },
    Session: {
      getActiveUser: () => ({ getEmail: () => 'active@example.test' }),
      getEffectiveUser: () => ({ getEmail: () => 'effective@example.test' })
    },
    ContentService: {
      MimeType: { JSON: 'application/json', TEXT: 'text/plain' },
      createTextOutput: content => ({
        getContent: () => content,
        setMimeType(type) { this.mimeType = type; return this; }
      })
    }
  };
  vm.runInNewContext(source, context, { filename: sourcePath });
  return {
    events,
    rows: sheetRows,
    post: payload => JSON.parse(context.doPost({ postData: { contents: JSON.stringify(payload) } }).getContent())
  };
}

test('payload inválido se rechaza sin acceder a la hoja ni realizar escrituras', () => {
  const h = makeHarness();
  const payload = validPayload();
  payload.telefono = '';
  const result = h.post(payload);
  assert.equal(result.ok, false);
  assert.equal(result.confirmed, false);
  assert.equal(result.error, 'invalid_telefono');
  assert.equal(h.events.some(([name]) => ['openById', 'setValue', 'appendRow', 'flush', 'sendEmail'].includes(name)), false);
});

test('confirma únicamente después de appendRow y flush', () => {
  const h = makeHarness();
  const result = h.post(validPayload());
  assert.deepEqual(h.events.map(([name]) => name).filter(name => ['appendRow', 'flush'].includes(name)), ['appendRow', 'flush']);
  assert.equal(result.ok, true);
  assert.equal(result.confirmed, true);
  assert.equal(result.duplicate, false);
  assert.ok(h.events.findIndex(([name]) => name === 'flush') < h.events.findIndex(([name]) => name === 'sendEmail'));
});

test('un error de appendRow nunca confirma', () => {
  const h = makeHarness({ appendError: true });
  const result = h.post(validPayload());
  assert.equal(result.ok, false);
  assert.equal(result.confirmed, false);
  assert.equal(result.error, 'save_failed');
  assert.equal(h.events.some(([name]) => name === 'flush' || name === 'sendEmail'), false);
});

test('un error de flush nunca confirma ni envía email', () => {
  const h = makeHarness({ flushError: true });
  const result = h.post(validPayload());
  assert.equal(result.ok, false);
  assert.equal(result.confirmed, false);
  assert.equal(result.error, 'save_failed');
  assert.equal(h.events.some(([name]) => name === 'sendEmail'), false);
});

test('un submissionId duplicado no agrega fila ni vuelve a enviar email', () => {
  const payload = validPayload();
  const rows = [
    ['Fecha', 'Vertical', 'Nivel', 'Nombre', 'Localidad', 'Teléfono', 'Email', 'Consumo', 'Problema', 'Prueba', 'Monto', 'Situación', 'Origen', 'Notas', 'Submission ID'],
    ['fecha anterior', 'Bancos', 'VERDE', 'Anterior', '', '', '', '', '', '', '', '', '', '', payload.submissionId]
  ];
  const h = makeHarness({ rows });
  const result = h.post(payload);
  assert.equal(result.confirmed, true);
  assert.equal(result.duplicate, true);
  assert.equal(h.rows.length, 2);
  assert.equal(h.events.some(([name]) => name === 'appendRow' || name === 'sendEmail'), false);
  assert.equal(h.events.some(([name]) => name === 'flush'), true);
});

test('fallo de email no revierte una confirmación persistida', () => {
  const h = makeHarness({ emailError: true });
  const result = h.post(validPayload());
  assert.equal(result.ok, true);
  assert.equal(result.confirmed, true);
  assert.equal(h.events.some(([name]) => name === 'flush'), true);
  assert.equal(h.events.some(([name]) => name === 'sendEmail'), true);
});

test('columna O ocupada con encabezado vacío no se sobrescribe', () => {
  const rows = [
    ['Fecha', 'Vertical', 'Nivel', 'Nombre', 'Localidad', 'Teléfono', 'Email', 'Consumo', 'Problema', 'Prueba', 'Monto', 'Situación', 'Origen', 'Notas', ''],
    ['dato existente', '', '', '', '', '', '', '', '', '', '', '', '', '', 'valor protegido']
  ];
  const h = makeHarness({ rows });
  const before = h.rows.map(row => [...row]);
  const result = h.post(validPayload());
  assert.equal(result.confirmed, false);
  assert.equal(result.error, 'save_failed');
  assert.deepEqual(h.rows, before);
  assert.equal(h.events.some(([name]) => name === 'setValue' || name === 'appendRow' || name === 'flush'), false);
});

test('encabezado inesperado en columna O no se sobrescribe', () => {
  const rows = [['Fecha', 'Vertical', 'Nivel', 'Nombre', 'Localidad', 'Teléfono', 'Email', 'Consumo', 'Problema', 'Prueba', 'Monto', 'Situación', 'Origen', 'Notas', 'No modificar']];
  const h = makeHarness({ rows });
  const before = h.rows.map(row => [...row]);
  const result = h.post(validPayload());
  assert.equal(result.confirmed, false);
  assert.equal(result.error, 'save_failed');
  assert.deepEqual(h.rows, before);
  assert.equal(h.events.some(([name]) => name === 'setValue' || name === 'appendRow' || name === 'flush'), false);
});

test('preserva A:N, conserva scores cero y escapa valores tipo fórmula', () => {
  const existing = ['fila previa', 'contenido', '', '', '', '', '', '', '', '', '', '', '', 'nota', ''];
  const h = makeHarness({ rows: [
    ['Fecha', 'Vertical', 'Nivel', 'Nombre', 'Localidad', 'Teléfono', 'Email', 'Consumo', 'Problema', 'Prueba', 'Monto', 'Situación', 'Origen', 'Notas', 'Submission ID'],
    existing
  ] });
  const payload = validPayload();
  payload.vertical = '=IMPORTDATA("x")';
  payload.nombre = '+Nombre';
  payload.localidad = '@ciudad';
  payload.telefono = '-123';
  payload.situacion = '=HYPERLINK("x")';
  payload.origen = '+web';
  const result = h.post(payload);
  assert.equal(result.confirmed, true);
  assert.deepEqual(h.rows[1], existing);
  assert.deepEqual(h.rows[2], [
    payload.fecha, "'=IMPORTDATA(\"x\")", payload.nivel, "'+Nombre", "'@ciudad", "'-123", payload.email,
    0, 0, 0, 0, "'=HYPERLINK(\"x\")", "'+web", '', payload.submissionId
  ]);
});
