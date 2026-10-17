/* CTA Samudio: intención, no consulta recibida. No recolecta href ni texto libre. */
(function () {
  'use strict';
  var allowed = ['cta_id', 'placement', 'destination_type', 'content_slug', 'vertical', 'nivel', 'origen', 'form_id'];
  var verticals = ['ahorro', 'banco', 'fintech', 'debito', 'descuentos'];
  function token(value) {
    return typeof value === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(value) ? value : '';
  }
  function origin() {
    try {
      var saved = JSON.parse(sessionStorage.getItem('es_cta_origin') || 'null');
      return saved && Date.now() - saved.at < 1800000 ? saved : null;
    } catch (_) { return null; }
  }
  window.samudioTrack = function (event, params) {
    var clean = {};
    allowed.forEach(function (key) {
      if (params && token(params[key])) clean[key] = params[key];
    });
    if (clean.vertical && verticals.indexOf(clean.vertical) === -1) delete clean.vertical;
    var previous = origin();
    if (previous) {
      if (token(previous.cta_id)) clean.cta_origen = previous.cta_id;
      if (token(previous.content_slug)) clean.nota_origen = previous.content_slug;
    }
    // Preview/test: eventos visibles en cola, sin cargar Google ni transmitir tráfico.
    if (!/^(www\.)?consumidormisiones\.com\.ar$/.test(location.hostname)) {
      window.samudioPreviewEvents = window.samudioPreviewEvents || [];
      window.samudioPreviewEvents.push({event:event, params:clean});
      return;
    }
    if (typeof window.gtag === 'function') window.gtag('event', event, clean);
  };
  function params(el) {
    return {
      cta_id: el.dataset.ctaId,
      placement: el.dataset.placement,
      destination_type: el.dataset.destination,
      content_slug: el.dataset.contentSlug,
      vertical: el.dataset.vertical,
      nivel: el.dataset.nivel,
      origen: el.dataset.placement
    };
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-cta-id]');
    if (!el) return;
    var p = params(el);
    var event = p.destination_type === 'whatsapp' ? 'whatsapp_click' : p.destination_type === 'email' ? 'mailto_click' : 'cta_click';
    window.samudioTrack(event, p);
    // Solamente atribución interna por pestaña. No guarda datos del visitante.
    if (p.destination_type === 'evaluador') {
      try { sessionStorage.setItem('es_cta_origin', JSON.stringify({cta_id:token(p.cta_id), content_slug:token(p.content_slug), at:Date.now()})); } catch (_) {}
    }
  });
  // Una impresión por elemento cuando al menos la mitad es visible.
  // El sticky oculto por transform no cuenta hasta entrar al viewport.
  if (typeof IntersectionObserver === 'undefined') return;
  var seen = new WeakSet();
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.5 || seen.has(entry.target)) return;
      seen.add(entry.target);
      window.samudioTrack('cta_view', params(entry.target));
    });
  }, {threshold:0.5});
  function watch(root) {
    root.querySelectorAll('[data-cta-id]').forEach(function (el) { observer.observe(el); });
  }
  watch(document);
  // El dictamen se crea después de completar el formulario.
  new MutationObserver(function (records) {
    records.forEach(function (record) {
      record.addedNodes.forEach(function (node) {
        if (node.nodeType !== 1) return;
        if (node.matches('[data-cta-id]')) observer.observe(node);
        watch(node);
      });
    });
  }).observe(document.body, {childList:true, subtree:true});
})();
