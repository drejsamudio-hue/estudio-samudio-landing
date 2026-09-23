# Pendientes y Mejora de Diseño — Landing Estudio Samudio

> **For agentic workers:** ejecutar tarea por tarea, en orden. Steps con checkbox (`- [ ]`).
> Cada fase termina con la verificación Playwright de la sección "Verificación" antes de commitear.

**Goal:** (1) cerrar los pendientes técnicos verificados del repo; (2) mejorar el diseño del landing
sin rediseñarlo: que el evaluador aparezca en la primera pantalla del celular, corregir defectos visuales
y unificar el sistema visual entre landing y notas.

**Tech Stack:** Jekyll 3.9 (GitHub Pages, build legacy desde `main`), `index.html` standalone,
`_layouts/default.html` + `post.html` para las 16 páginas restantes. GA4 `G-LTD1RWM91T`.

**Verificación local (nuevo — antes no existía):** Ruby está disponible en el entorno cloud.

```bash
gem install --no-document jekyll:3.10.0 jekyll-seo-tag jekyll-feed jekyll-sitemap kramdown-parser-gfm webrick
JEKYLL_NO_BUNDLER_REQUIRE=true ruby "$(gem contents jekyll | grep 'exe/jekyll$')" build -d /tmp/site --baseurl /estudio-samudio-landing
mkdir -p /tmp/srv && ln -sfn /tmp/site /tmp/srv/estudio-samudio-landing && (cd /tmp/srv && python3 -m http.server 8765 &)
```

Con eso se puede probar con Playwright (Chromium preinstalado) sin pushear a `main`.

---

## Parte A — Pendientes técnicos (EJECUTADO en esta rama)

| # | Hallazgo verificado | Estado |
|---|---|---|
| A1 | Plan 2026-09-02: las 7 tareas estaban hechas en `main` pero el documento no lo registraba. Verificado en producción: 17 URLs en sitemap, todas 200; 1 canonical por nota; `docs/` da 404. | ✅ `dec7c40` marca el plan como ejecutado |
| A2 | **`dictamen_view` falso** — se disparaba con `setTimeout(600)` en un listener aparte: también cuando la validación del paso 3 fallaba (reportaba `ROJO` sin dictamen) y con nivel equivocado si el POST a la planilla tardaba >600 ms. Probable causa de lo que describe `GA4_DIAGNOSTIC.md`. | ✅ `5502b1a` |
| A3 | **Datos personales enviados a GA4** — `whatsapp_click` mandaba el `href`, que contiene nombre y teléfono del mensaje pre-llenado. Incompatible con los términos de GA4 y con la Ley 25.326 (y con lo que dice `/privacidad/`). | ✅ `5502b1a` — ahora `{vertical, nivel, origen}` |
| A4 | Eventos anteriores a la carga diferida de `gtag.js` (3 s / scroll) se perdían: `gtag` no existía todavía. | ✅ `5502b1a` — cola `dataLayer` definida de entrada |
| A5 | `/quien-soy/` y `/privacidad/` (layout `post`) mostraban breadcrumb `Inicio · Notas · ` vacío, eyebrow vacío, línea de autor sin fecha y un `BreadcrumbList` erróneo. JSON-LD de FAQ usaba `escape` (entidades HTML dentro de JSON). | ✅ `ffa2b00` |
| A6 | `apple-touch-icon` apuntaba al SVG (iOS lo ignora); los PNG 192/512 ya existían. | ✅ `5502b1a` (index) + `e45d235` (layout) |

Verificado: build Jekyll limpio, 49 bloques JSON-LD parsean como JSON válido, recorrido completo del
wizard en Chromium → eventos `vertical_selected, step2_completed, form_start, dictamen_view{VERDE}, whatsapp_click`,
un solo `dictamen_view`, cero PII en `dataLayer`, cero errores JS.

**Pendientes fuera del repo (requieren al Dr. Samudio):**
- [ ] GA4 → Tiempo real: confirmar que `dictamen_view` llega tras el deploy; marcarlo como conversión clave.
- [ ] Search Console: reenviar `sitemap.xml`.
- [ ] Google Business Profile "Estudio Samudio — Posadas" → pegar la URL en `sameAs` (hoy `[]` en ambos JSON-LD).
- [ ] Foto profesional (retrato + despacho) para `/quien-soy/` y `og:image`.
- [ ] Dominio propio (`url`/`baseurl` en `_config.yml`, `robots.txt`, URLs absolutas de `index.html`).

---

## Parte B — Diagnóstico de diseño (medido, no estimado)

Mediciones con Playwright sobre el build local (fuentes reales cargadas):

| Métrica | 390×844 (iPhone 12–15) | 360×740 (Android gama media) | 1366×900 |
|---|---|---|---|
| Borde superior de la 1.ª tarjeta del evaluador | **794 px** (el fold está en 844) | **794 px — fuera de pantalla** | 626 px |
| Alto del paso 1 | **1676 px** | 1727 px | 1072 px |
| H1 / H2 | **26 px / 29 px** | 26 / 29 | **26 / 40** |
| Color de títulos de tarjeta | `#000` (no `--tinta`) | idem | idem |

### Qué funciona y hay que conservar
- **El concepto "expediente"** (fojas I-II-III, línea de margen, dictamen con estampa, papel cálido,
  tinta azul + tierra) es distintivo y coherente con un estudio jurídico. No reemplazarlo por un template
  genérico de "abogados": es el principal activo visual.
- Paleta con un solo acento (`--tierra`, 5.5:1 sobre papel — AA). Botones de 56–60 px de alto.
- Dictamen VERDE/AMARILLO/ROJO con normas citadas: diferencial real frente a la competencia.

### Defectos (bugs visuales)
- **D1 — La línea de margen roja atraviesa el header en desktop**: cruza el texto "ESTUDIO SAMUDIO"
  y la franja del testimonio. El header y esa franja tienen `padding: 22px` y no respetan la columna
  (`calc(var(--margen) + 40px)`).
- **D2 — Títulos de tarjetas en negro puro**: `<button>` no hereda `color`; falta `.vbtn{color:inherit}`.
- **D3 — Jerarquía invertida**: el H1 del hero (26 px, inline) es más chico que el H2 del paso
  (29–40 px). La regla `h1{font-size:clamp(42px,8vw,72px)}` quedó pisada por un `style=""`.
- **D4 — Franja de testimonio desalineada en mobile**: `padding-left: calc(var(--margen)+40px)` = 40 px
  con `--margen:0`, contra 22 px del resto.
- **D5 — Contraste en notas**: `--tinta-45` vale `#8C93A0` en `default.html` (**2.89:1**, falla AA) y
  `#5A6474` en `index.html` (5.6:1). Afecta la nav del masthead de las 16 páginas. `DESIGN.md` documenta
  el valor que falla.

### Fricciones (CRO / UX)
- **F1 — Ninguna opción del evaluador visible sin scroll en mobile.** Entre el header, hero, 3 checks,
  testimonio, foliado, microcopy y 52 px de `padding-top`, la primera tarjeta arranca en 794 px.
  Es la fricción más cara del sitio: el landing es el evaluador.
- **F2 — Redundancias**: "4 preguntas · 30 segundos" aparece dos veces antes del fold; el testimonio de
  R. M. aparece dos veces; bloque `.credenciales` oculto con `display:none`; ~55 líneas de CSS muerto
  (`data-papel`, `.sello`, `.bajada`, `.lugar`).
- **F3 — Tarjetas de vertical demasiado altas en mobile** (≈260 px c/u × 5): el paso 1 mide 1676 px.
  La fila "ES MI CASO →" es redundante: toda la tarjeta es el botón.
- **F4 — Sticky CTA mal temporizado**: aparece a los 8 s aunque el usuario ya esté en el paso 2 o 3
  ("Evaluar mi caso" no tiene sentido ahí) y tapa la primera tarjeta en mobile.
- **F5 — Prueba social lejos del formulario**: el testimonio está arriba y abajo, pero no junto al
  paso 3, que es donde se decide dejar el teléfono (informe estratégico, palanca C3).
- **F6 — Desktop: 5 tarjetas en grilla de 2** → la quinta queda huérfana a la izquierda.
- **F7 — Landing y notas parecen dos sitios**: header distinto (franja mono vs masthead con nav),
  ancho distinto (880 vs 760), línea de margen solo en el landing. En desktop el masthead de notas
  parte la nav en una segunda línea.

---

## Parte C — Plan de mejora

Orden pensado para que cada fase sea publicable sola. Fases 1–3 tocan solo `index.html`.

### Fase 1 — Defectos y limpieza (riesgo bajo, sin decisión de diseño)

**Files:** `index.html`, `_layouts/default.html`, `DESIGN.md`

- [ ] D2: agregar `color:inherit` a `.vbtn`.
- [ ] D1: pasar el header y la franja superior a la columna de contenido (`.cuerpo`) y hacer que
      `.hoja::before/::after` arranquen debajo del header (`top: <alto header>`), o dar al header
      `position:relative;z-index:1;background:var(--papel)`.
- [ ] D4: franja de testimonio con el mismo padding que `.cuerpo` en mobile.
- [ ] D5: `--tinta-45:#5A6474` en `default.html` (igual que index) y actualizar `DESIGN.md`.
      Si se quiere conservar un gris más claro, solo para texto ≥18.66 px bold o decorativo.
- [ ] F2: borrar `.credenciales` oculto, CSS `data-papel`/`.sello`/`.bajada`/`.lugar`, el segundo
      "4 preguntas · 30 segundos". **No** borrar el CSS `data-escala` hasta decidir Fase 4.
- [ ] F4: mostrar el sticky solo mientras el paso 1 está activo y el usuario scrolleó **más allá**
      de las tarjetas; ocultarlo en pasos 2–4.

### Fase 2 — Primera pantalla mobile (el cambio de mayor impacto)

**Objetivo medible:** en 390×844 la **primera tarjeta completa** visible sin scroll
(bottom ≤ 844 px); en 360×740, al menos su título visible.

- [ ] Hero con jerarquía real: H1 34–38 px mobile / 48–56 px desktop (usar la regla `h1` existente,
      quitar el `style` inline). Bajada en una línea: "4 preguntas · 30 segundos · gratis y sin compromiso".
- [ ] Credenciales como **una fila de 3 chips** compactos (`Mat. CAM 4372 · STJM 4031`,
      `Solo derecho del consumidor`, `Primera evaluación gratis`) en lugar de 3 renglones con fondo.
- [ ] Sacar la franja de testimonio de arriba (se mueve al paso 3 en Fase 3).
- [ ] `.anot{padding-top}` 52 → 24 px en mobile; "Foja I" inline junto al H2 (ya es así en mobile,
      solo ajustar margen).
- [ ] Eliminar el microcopy duplicado bajo el foliado.

Referencia de layout mobile (texto):

```
ESTUDIO SAMUDIO                POSADAS · MISIONES
Evaluá tu caso
sin compromiso                       ← H1 36px
4 preguntas · 30 s · gratis          ← 15px
[Mat. CAM 4372] [Solo consumo] [Gratis]  ← chips
( I )──────( II )──────( III )
FOJA I  ¿Sobre qué es tu situación?
┌─[ico] Plan de ahorro de auto    › ┐ ← tarjeta compacta, 76–88px
└─      Cuota disparada, no entregan ┘
┌─[ico] Reclamo bancario           › ┐
```

### Fase 3 — Tarjetas, paso 3 y dictamen

- [ ] F3: en mobile (<660 px) tarjeta horizontal: ícono 40 px a la izquierda, título 19 px, bajada
      corta de una línea (ver heurística #4 del informe: "Cuota impagable · no entregan el auto"),
      chevron `›` a la derecha; ocultar la fila "ES MI CASO". Paso 1 objetivo: ≤ 800 px de alto.
      La bajada larga actual se mantiene en desktop.
- [ ] F6: en desktop la 5.ª tarjeta ocupa las dos columnas en formato horizontal
      (`.vbtn:last-child{grid-column:1/-1;flex-direction:row}`).
- [ ] F5: bloque de confianza junto al formulario del paso 3: 1 testimonio corto + matrículas +
      "Te contactamos solo por tu consulta · respuesta en 24 h hábiles".
- [ ] CTA en primera persona: "Ver mi evaluación" → "Ver mi resultado" (informe, palanca C4).
- [ ] Dictamen ROJO: agregar WhatsApp "Consultar de todos modos" además del email
      (hoy el lead frío solo puede escribir mail).
- [ ] Accesibilidad del wizard: `aria-labelledby` en cada `radiogroup` apuntando a `.qt`;
      `aria-invalid` + `aria-describedby` en errores (`.emsg` con id); mover el foco al dictamen
      (`tabindex=-1` en `#resultBox`) al llegar al paso 4.
- [ ] `.pie-legal` en Inter 14 px en lugar de mono 13.5 px (legibilidad; informe §7.2).

### Fase 4 — Sistema visual compartido (requiere decisión)

- [ ] F7: masthead común landing/notas (marca a la izquierda, "Guías" + "Quién soy" a la derecha,
      una sola línea en desktop). En el landing, nav mínima para no distraer del evaluador.
- [ ] Unificar tokens: hoy están copiados a mano en dos archivos y ya divergieron (D5).
      **Opción recomendada:** `_includes/tokens.css` incluido inline en ambos
      (requiere agregar front matter vacío a `index.html`; verificar que ninguna cadena del JS
      contenga `{{` o `{%`). Alternativa: `assets/css/base.css` (1 request extra, cacheable).
- [ ] Control de tamaño de texto **A / A+ / A++** en el header, usando el CSS `data-escala` que ya
      existe y hoy nadie activa. Encaja con el público (jubilados, hipervulnerables — la propia
      pregunta del paso 3). Persistir en `localStorage` con `try/catch`.

### Fase 5 — Identidad (depende de material del estudio)

- [ ] Foto real del Dr. Samudio: chip con avatar en el hero y retrato en `/quien-soy/` (E-E-A-T).
- [ ] `og:image` con foto + placa en la paleta del sitio (regla 1 de `DESIGN.md`).
- [ ] Reseñas de Google Business Profile junto al paso 3 cuando haya ≥ 10.

---

## Verificación (cada fase)

Script Playwright contra el build local:

1. Posición de la primera tarjeta y alto del paso 1 en 390×844, 360×740 y 1366×900 (objetivos de Fase 2/3).
2. `document.documentElement.scrollWidth <= innerWidth` en 320, 360 y 390 px (sin scroll horizontal).
3. Recorrido completo del wizard en los 5 verticales × 3 niveles: un solo `dictamen_view`, sin PII en `dataLayer`, sin errores JS.
4. Capturas antes/después en mobile y desktop.
5. Tras el merge: PageSpeed Insights mobile (LCP < 2.5 s, CLS < 0.1) y GA4 Tiempo real.

## Decisiones abiertas

1. **¿Ejecutar Fases 1–3 juntas o por separado?** Recomendado: Fase 1 sola (cero riesgo), luego 2+3 juntas
   porque ambas cambian la altura del paso 1 y conviene medirlas en conjunto.
2. **Tokens compartidos**: include inline (recomendado) vs CSS externo.
3. **Control A/A+/A++**: activarlo (recomendado) o borrar el CSS `data-escala`.
