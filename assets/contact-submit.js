(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.ContactoSubmit = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  async function submitContact(url, payload, options) {
    const opts = options || {};
    const fetchImpl = opts.fetchImpl || (typeof fetch === 'function' ? fetch : null);
    const AbortControllerImpl = opts.AbortControllerImpl || (typeof AbortController === 'function' ? AbortController : null);
    const timeoutMs = Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : 15000;
    const mode = opts.mode === 'cors' ? 'cors' : 'no-cors';

    if (!url || !fetchImpl || !AbortControllerImpl) {
      return { status: 'unconfirmed', reason: 'unavailable' };
    }

    const controller = new AbortControllerImpl();
    let timedOut = false;
    const timer = setTimeout(function () {
      timedOut = true;
      controller.abort();
    }, timeoutMs);

    try {
      const response = await fetchImpl(url, {
        method: 'POST',
        mode,
        // Tipo permitido en no-cors y simple en CORS para evitar preflight.
        // El cuerpo sigue siendo JSON: Apps Script parsea postData.contents.
        // Esto no vuelve legible una respuesta opaca ni confirma persistencia.
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      if (!response || response.type === 'opaque') {
        return { status: 'unconfirmed', reason: 'opaque_response' };
      }
      if (mode === 'no-cors') {
        return { status: 'unconfirmed', reason: 'no_cors_unverifiable' };
      }
      if (!response.ok) {
        return { status: 'failed', reason: 'http_error' };
      }

      let body;
      try {
        body = await response.json();
      } catch (_) {
        return { status: 'unconfirmed', reason: 'invalid_response' };
      }
      if (body && body.ok === true && body.confirmed === true) {
        return { status: 'confirmed' };
      }
      if (body && (body.ok === false || body.confirmed === false)) {
        return { status: 'failed', reason: 'backend_rejected' };
      }
      return { status: 'unconfirmed', reason: 'confirmation_missing' };
    } catch (_) {
      return { status: 'unconfirmed', reason: timedOut ? 'timeout' : 'network_error' };
    } finally {
      clearTimeout(timer);
    }
  }

  return { submitContact };
});
