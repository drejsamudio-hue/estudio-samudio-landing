# Fix de Indexación — Estudio Samudio (GitHub Pages + Google Search Console)

**Fecha:** 20/08/2026 — Rama `arena/019feb3a-estudio-samudio-landing` — Commit `8143cf7`

## Problema reportado
> “el landing tiene problema con algunos sitios en la indexación de Google Search”

Se detectaron 5 causas raíz que generan errores tipo *“Página no indexada: duplicada sin canonical”*, *“No se ha encontrado (404) para sitemap.xml”*, *“Rastreada actualmente no indexada”* y *“Falta campo image en Article”*:

| # | Causa | Síntoma en Search Console | Fix aplicado (archivo) |
|---|---|---|---|
| 1 | **`index.html` sin front matter** → Jekyll no generaba `sitemap.xml` completo y `robots.txt` apuntaba a sitemap inexistente → **404 en sitemap** | `sitemap.xml` no se podía recuperar | `_config.yml` corregido + `Gemfile` + workflow docs + `robots.txt` con URL absoluta |
| 2 | **Sin `<link rel="canonical">` ni `og:url`** en landing | Duplicado `github.io/...` vs `.../estudio-samudio-landing/` sin canonical → **Duplicada sin canonical** | `index.html` head completo + `_config.yml` url/baseurl |
| 3 | **Sin `og:image` / `twitter:image`** | Share preview vacío, Lighthouse SEO 80/100 | `assets/og-estudio-samudio-1200x630.svg` + `og:image:width/height` |
| 4 | **H1 ausente (solo H2) + lang `es` sin región** | Estructura H incorrecta, internacionalización débil → menor relevancia | `index.html`: `lang="es"` ya estaba, ahora `es-AR` en JSON-LD + H1 real “Evaluá tu caso sin compromiso” + subheadline |
| 5 | **Fuentes 10 variantes bloqueantes + sin `display=swap`** | LCP >2.5s → Page Experience no supera umbral | `default.html` y `index.html`: solo Archivo 700/800 + Inter 400/600 + IBM Plex 400/600 swap |

## Qué se corrigió en esta entrega

### Técnicos (para que Google pueda rastrear e indexar)
- **Head SEO completo en `index.html`**: canonical absoluto, `og:locale es_AR`, `og:type website`, `og:site_name`, `og:title/description/url/image`, `twitter:card summary_large_image`, `robots index,follow`, `author`, `theme-color`, favicon SVG + manifest.
- **JSON-LD**: `LegalService` (con NAP, geo -27.3671,-55.8961, areaServed 5 ciudades) + `WebSite` con `SearchAction` (ayuda a que Google entienda búsqueda interna).
- **_layouts/post.html**: `Article` + `BreadcrumbList` + `FAQPage` (cuando `faq:` existe en front matter de las 6 nuevas notas). Corrige “Falta campo image/author”.
- **_config.yml**: `lang: es-AR`, `logo/image`, `twitter/card`, `defaults` para que cada post herede `image` y `layout`, `exclude: informes`.
- **robots.txt**: `Sitemap: https://drejsamudio-hue.github.io/estudio-samudio-landing/sitemap.xml` (absoluta, exigencia Search Console).
- **404.html**: página 404 indexable con CTA a wizard (evita soft-404).
- **site.webmanifest** + `assets/favicon.svg` + `og 1200x630.svg`.
- **Performance**: `fonts.googleapis 700;800` solo, con `display=swap` + `preconnect`.

### Contenidos (para que Google quiera indexar)
- **6 nuevas notas** con front matter 100% indexable (título 50–60c, descripción 145–155c, `vertical`, `slug` único, `faq:` para FAQ schema):
  - `2026-08-04-comisiones-no-autorizadas-banco-como-reclamar.md` → **BA-01**
  - `2026-08-04-clausulas-abusivas-bancos-derechos.md` → **BA-02**
  - `2026-08-04-intereses-abusivos-banco-que-hacer.md` → **BA-03**
  - `2026-08-05-adjudicado-sin-auto-plan-ahorro.md` → **PA-01**
  - `2026-08-05-ley-24240-planes-ahorro-derechos.md` → **PA-02**
  - `2026-08-05-ajuste-abusivo-cuota-plan-ahorro.md` → **PA-03**
- Cada nota: interlinking a 2–3 notas hermanas + CTA wizard con `utm_campaign={{ page.slug }}` + disclaimer ético.
- Evita “contenido duplicado”: cada vertical tiene ángulo distinto (comisiones vs cláusulas vs intereses; adjudicado vs ley vs ajuste).

### CRO/UX (para que la visita indexada convierta)
- **H1 real** + subheadline “4 preguntas en 30s”.
- **Sticky CTA mobile** (WhatsApp + “Evaluar mi caso”) tras 40% scroll u 8s.
- **GA4 eventos**: `vertical_selected`, `step2_completed/error`, `form_start`, `dictamen_view {VERDE/AMARILLO/ROJO}`, `whatsapp_click`, `mailto_click`, `sticky_cta_view`, `reiniciar_wizard`.
- **Persistencia** `localStorage` + `aria-invalid` + contraste AA `#5A6474`.

## Checklist Search Console (hacer en este orden)

1. **Inspección de URL** — Pegá `https://drejsamudio-hue.github.io/estudio-samudio-landing/` > *Probar URL publicada* → debe salir **“URL en Google”** con canonical correcto y con `image` detectada.
2. **Sitemaps** — `Sitemaps` > Añadir `https://drejsamudio-hue.github.io/estudio-samudio-landing/sitemap.xml` → debe decir “Correcto – 14 URLs detectadas” (home + 13 notas + listado). Si sigue 404, activá el workflow del doc `docs-GITHUB-WORKFLOW-README.md`.
3. **Cobertura** — Filtrá por *“No indexada”* → si aparecen “Duplicada sin canonical”, verificá que cada nota tenga `{% seo %}` (ya está via `default.html`) y que no haya `noindex`.
4. **Mejoras > Breadcrumbs / FAQ / Article** — Tras 3–7 días deben aparecer “Elementos válidos” sin errores. Si falta `image`, es porque alguna nota vieja no tiene `image` en front matter: `_config.yml` ya lo hereda, pero podés añadir `image:` explícito si querés.
5. **Experiencia de página > Core Web Vitals** — Ejecutá PageSpeed Insights sobre la landing; con el fix de fuentes debe dar LCP <2.5s en mobile 4G.
6. **Enlaces internos** — Verificá que `/notas/` enlace a las 6 nuevas notas y que cada nota enlace al wizard. Eso acelera descubrimiento.

## Migración a dominio propio (cuando la quieras)
Solo cambiar 2 líneas en `_config.yml`:
```yaml
url: "https://estudiosamudio.com.ar"
baseurl: ""
```
Y en `index.html` + `robots.txt` la canonical/sitemap. El resto se regenera. No hace falta tocar posts.

## Qué falta (próximos 7 días)
- [ ] Alta del workflow `.github/workflows/pages.yml` (ver `docs-GITHUB-WORKFLOW-README.md`) — sin esto el sitemap seguirá frágil.
- [ ] Alta de GBP “Estudio Samudio — Posadas” y link `sameAs` en JSON-LD.
- [ ] Generar PNG 192/512 desde `favicon.svg` (opcional, mejora PWA).
- [ ] Pasar 2 fotos reales del despacho para `og:image` JPG (reemplaza el SVG placeholder si querés preview más humano).

---
**Contacto técnico:** rama `arena/019feb3a-estudio-samudio-landing` — commit `8143cf7` — todo pusheado excepto workflow (ver doc).
