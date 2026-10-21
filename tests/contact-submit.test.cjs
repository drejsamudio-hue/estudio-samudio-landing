const test = require('node:test');
const assert = require('node:assert/strict');
const { submitContact } = require('../assets/contact-submit.js');

const url = 'https://example.invalid/exec';
const payload = { submissionId: 'test-id', nombre: 'Dato de prueba' };

const response = (body, extra = {}) => ({
  ok: true,
  type: 'basic',
  json: async () => body,
  ...extra
});

test('confirma solo con respuesta legible que confirma persistencia', async () => {
  let request;
  const result = await submitContact(url, payload, {
    mode: 'cors',
    fetchImpl: async (requestUrl, options) => {
      request = { requestUrl, options };
      return response({ ok: true, confirmed: true });
    }
  });
  assert.deepEqual(result, { status: 'confirmed' });
  assert.equal(request.requestUrl, url);
  assert.equal(request.options.mode, 'cors');
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.headers['Content-Type'], 'text/plain;charset=UTF-8');
});

test('un HTTP de error se clasifica como falla', async () => {
  const result = await submitContact(url, payload, {
    mode: 'cors',
    fetchImpl: async () => response(null, { ok: false, status: 500 })
  });
  assert.deepEqual(result, { status: 'failed', reason: 'http_error' });
});

test('un rechazo explícito del backend se clasifica como falla', async () => {
  const result = await submitContact(url, payload, {
    mode: 'cors',
    fetchImpl: async () => response({ ok: false, confirmed: false })
  });
  assert.deepEqual(result, { status: 'failed', reason: 'backend_rejected' });
});

test('una respuesta no-CORS opaca nunca confirma el contacto', async () => {
  const result = await submitContact(url, payload, {
    fetchImpl: async () => ({ type: 'opaque', ok: false })
  });
  assert.deepEqual(result, { status: 'unconfirmed', reason: 'opaque_response' });
});

test('el modo no-cors predeterminado nunca confirma ni una respuesta simulada legible', async () => {
  let request;
  const result = await submitContact(url, payload, {
    fetchImpl: async (_requestUrl, options) => {
      request = options;
      return response({ ok: true, confirmed: true });
    }
  });
  assert.equal(request.mode, 'no-cors');
  assert.deepEqual(result, { status: 'unconfirmed', reason: 'no_cors_unverifiable' });
});

test('una respuesta sin indicador explícito de confirmación queda no confirmada', async () => {
  const result = await submitContact(url, payload, {
    mode: 'cors',
    fetchImpl: async () => response({ ok: true })
  });
  assert.deepEqual(result, { status: 'unconfirmed', reason: 'confirmation_missing' });
});

test('una falla de red queda no confirmada porque el POST pudo llegar al backend', async () => {
  const result = await submitContact(url, payload, {
    fetchImpl: async () => { throw new TypeError('Network error'); }
  });
  assert.deepEqual(result, { status: 'unconfirmed', reason: 'network_error' });
});

test('un timeout abortado queda no confirmado porque el backend pudo guardar', async () => {
  const result = await submitContact(url, payload, {
    timeoutMs: 10,
    fetchImpl: (_url, options) => new Promise((resolve, reject) => {
      options.signal.addEventListener('abort', () => {
        const error = new Error('aborted');
        error.name = 'AbortError';
        reject(error);
      }, { once: true });
    })
  });
  assert.deepEqual(result, { status: 'unconfirmed', reason: 'timeout' });
});
