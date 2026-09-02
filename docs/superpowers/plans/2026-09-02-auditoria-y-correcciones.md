# Auditoría y Correcciones — Landing Estudio Samudio

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cerrar las brechas verificadas entre lo que los commits dicen haber hecho y lo que realmente está publicado, y eliminar la causa raíz del churn de deploys.

**Architecture:** Sitio Jekyll servido por GitHub Pages. La landing (`index.html`) es una página standalone con su propio `<head>`; las otras 16 páginas (índice de notas + 13 notas + quien-soy + privacidad) se renderizan vía `_layouts/default.html`. Las correcciones se concentran en `default.html`, que quedó fuera de las últimas dos iteraciones de performance.

**Tech Stack:** Jekyll 3.9 (GitHub Pages legacy build), kramdown/GFM, jekyll-seo-tag, jekyll-feed, GA4 (`G-LTD1RWM91T`).

---

## Estado verificado en producción (2026-09-02)

Todo lo de abajo fue comprobado con `curl` contra `https://drejsamudio-hue.github.io/estudio-samudio-landing/`, no contra el repo.

**Lo que funciona:**

| Comprobación | Resultado |
|---|---|
| `sitemap.xml` | HTTP 200, `application/xml`, 16 URLs, front matter correctamente removido |
| Las 16 URLs del sitemap | **todas** HTTP 200 |
| `robots.txt` | HTTP 200, apunta al sitemap absoluto |
| `/notas/`, `/quien-soy/`, `/privacidad/`, `/404.html` | HTTP 200 |
| Último build de Pages | `status: built`, commit `d51a516` |

**La saga del sitemap terminó bien.** El commit `d51a516` resolvió el problema. Los 6 commits de churn no dejaron nada roto en producción.

---

## Brechas encontradas

### B1 — Regresión sin commitear en `sitemap.xml` (CRÍTICA)

La copia de trabajo tiene el front matter roto:

```
---
layout: false
---<?xml version="1.0" encoding="UTF-8"?>
```

El `---` de cierre y el `<?xml` quedaron en la misma línea. La versión **commiteada** está bien (`---\n<?xml`). Si esto se commitea, Jekyll deja de reconocer el front matter y vuelve a romper el sitemap — exactamente el bug que costó 6 commits.

### B2 — La optimización de performance se aplicó a 1 de 17 páginas

Los commits `0acd2e0` ("perf+cro: fonts async, gtag diferido") y `5cc1489` ("perf+a11y: fonts optional (CLS→0), sin preload") tocaron **únicamente `index.html`**:

```
0acd2e0  index.html | 71 ++++++-------
5cc1489  index.html |  7 +++----
```

`_layouts/default.html` — que renderiza las 16 páginas de contenido, que son el activo SEO entero — nunca recibió el cambio:

| | `index.html` (optimizado) | `_layouts/default.html` (sin tocar) |
|---|---|---|
| Fuentes | `media="print" onload="this.media='all'"` (async) | `rel="stylesheet"` (render-blocking) |
| `display` | `optional` (CLS = 0) | `swap` (provoca CLS) |
| gtag | inyectado por JS tras carga | `<script async>` directo en `<head>` |

Las 13 notas y el índice cargan más lento y con más CLS que la home.

### B3 — Canonical duplicado en 14 páginas

`_layouts/default.html:6` emite `{% seo %}`, que ya genera un canonical. Las líneas 22–24 emiten otro:

```liquid
{% if page.url == "/notas/" or page.layout == "post" %}
<link rel="canonical" href="{{ page.url | absolute_url }}">
{% endif %}
```

Verificado en producción: `/notas/aumento-cuota-plan-ahorro/` devuelve **2 etiquetas canonical**. Afecta a `/notas/` + las 13 notas.

### B4 — Carrera de deploys (causa raíz del churn)

`gh api .../pages` devuelve:

```json
{"build_type":"legacy","source":{"branch":"main","path":"/"}}
```

Pages está en modo **"Deploy from a branch"**, no "GitHub Actions". Pero el repo también tiene `.github/workflows/pages.yml`, que corre en cada push y también despliega. Resultado: **dos deployments al mismo entorno con ~6 segundos de diferencia**:

```
2026-08-29T16:41:52Z  env=github-pages  task=deploy
2026-08-29T16:41:46Z  env=github-pages  task=deploy
```

El que termina último gana, de forma no determinista. El workflow custom reporta "success" pero **no es el que sirve el sitio**. El trabajo invertido en `a8f69ca` y `bcc6dc8` fue sobre un workflow que no publica.

### B5 — `/notas/` se perdió del sitemap en una "restauración"

La página existe y devuelve 200, pero no figura entre las 16 URLs. No es un olvido al agregar una nota: es una **regresión introducida al restaurar el archivo**. El historial del `sitemap.xml` lo muestra sin ambigüedad:

| Commit | URLs | ¿Tiene `/notas/`? |
|---|---|---|
| `29adad7` create manual sitemap | **17** | **sí** |
| `ff834c5` limpia SEO assets y sitemap | 0 (borrado) | — |
| `61669b7` **restaurar sitemap.xml manual** | **16** | **no** |
| `ed5aac2` → `d51a516` | 16 | no |

El commit `61669b7` dice "restaurar" pero reconstruyó el archivo con una URL menos. `fix_sitemap.py` (todavía en la raíz del repo) tiene la lista hardcodeada de esas 16 URLs y confirma el origen: `/notas/` nunca estuvo en el array.

La memoria del proyecto registraba "Sitemap: 17 URLs" — el número correcto. Producción sirve 16 desde el 28/08.

### B6 — Basura versionable en la raíz del repo

- `fix_sitemap.py` — script descartable de la iteración anterior
- `sitemap_check.txt` — volcado de depuración
- `archive-xjoMIX/gk_3.1.70_windows_amd64.zip` — binario de GitKraken (no pertenece al repo)

Además: `docs/` (donde vive este plan) **no** está en `exclude` de `_config.yml`, así que Jekyll lo publicaría en el sitio.

### B7 — Deuda estructural: sitemap manual

`jekyll-sitemap` está deshabilitado con este comentario en `_config.yml`:

> `jekyll-sitemap deshabilitado: genera URLs relativas que Search Console no resuelve.`

Ese diagnóstico es incorrecto: `jekyll-sitemap` genera URLs absolutas cuando `url` y `baseurl` están definidos, y en este repo **lo están**. La consecuencia de la decisión es que cada nota nueva exige editar XML a mano — y B5 demuestra que el proceso ya falló una vez.

---

## Global Constraints

- **No hay Ruby ni Jekyll local.** `ruby`, `bundle` y `jekyll` no existen en esta máquina. El único ciclo de verificación posible es: commit → push → esperar el build de Pages → `curl` contra producción. Todo "test" en este plan es un `curl`.
- **Verificar siempre contra producción**, nunca contra `_site/` ni contra el repo.
- URL base de producción: `https://drejsamudio-hue.github.io/estudio-samudio-landing/`
- GA4 measurement ID: `G-LTD1RWM91T` — no cambiarlo.
- El build de Pages tarda ~40 s. Esperar con `gh run watch` o `sleep 60` antes de hacer `curl`.
- Un push a `main` publica en vivo. No hay staging.
- No tocar `index.html`: ya está optimizado y funcionando.

---

## Fase 0 — Contención

### Task 1: Restaurar `sitemap.xml` y limpiar el repo

Esto va primero porque B1 es una bomba armada: cualquier `git add .` publica la regresión.

**Files:**
- Restore: `sitemap.xml`
- Delete: `fix_sitemap.py`, `sitemap_check.txt`, `archive-xjoMIX/`
- Modify: `_config.yml` (agregar `docs` a `exclude`)
- Modify: `.gitignore`

**Interfaces:**
- Produces: un árbol de trabajo limpio; `sitemap.xml` idéntico a `d51a516`.

- [ ] **Step 1: Confirmar que la regresión existe y que lo commiteado está sano**

```bash
git diff sitemap.xml
```

Esperado: ver `-<?xml version="1.0" encoding="UTF-8"?>` y `+---<?xml version="1.0" encoding="UTF-8"?>`. Eso confirma que el archivo commiteado es el bueno y la copia de trabajo es la rota.

- [ ] **Step 2: Restaurar el archivo**

```bash
git restore sitemap.xml
```

- [ ] **Step 3: Verificar que el front matter quedó en 3 líneas separadas**

```bash
head -4 sitemap.xml
```

Esperado exactamente:

```
---
layout: false
---
<?xml version="1.0" encoding="UTF-8"?>
```

Si `---` y `<?xml` siguen en la misma línea, la restauración falló. No continuar.

- [ ] **Step 4: Borrar los archivos descartables**

```bash
rm -f fix_sitemap.py sitemap_check.txt
rm -rf archive-xjoMIX
```

- [ ] **Step 5: Excluir `docs/` de la publicación**

En `_config.yml`, dentro del bloque `exclude:`, agregar una línea después de `- informes`:

```yaml
  - informes
  - docs
  - scripts
```

- [ ] **Step 6: Evitar que la basura vuelva**

Agregar al final de `.gitignore`:

```
archive-*/
*.zip
sitemap_check.txt
fix_sitemap.py
```

- [ ] **Step 7: Revisar qué se va a commitear**

```bash
git status
```

Esperado: modificados `_config.yml` y `.gitignore`; `sitemap.xml` **ya no** aparece como modificado; no quedan untracked salvo `docs/`.

- [ ] **Step 8: Commit**

```bash
git add _config.yml .gitignore docs/
git commit -m "chore: restaura sitemap.xml, limpia scratch files y excluye docs/ del build

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

- [ ] **Step 9: Push y esperar el build**

```bash
git push && gh run watch
```

- [ ] **Step 10: Verificar que el sitemap sigue sano en producción**

```bash
curl -s -o /tmp/sm.xml -w "HTTP %{http_code} | %{content_type}\n" "https://drejsamudio-hue.github.io/estudio-samudio-landing/sitemap.xml" && head -1 /tmp/sm.xml && grep -c "<loc>" /tmp/sm.xml
```

Esperado: `HTTP 200 | application/xml`, primera línea `<?xml version="1.0" encoding="UTF-8"?>`, y `16`.

- [ ] **Step 11: Verificar que `docs/` NO se publicó**

```bash
curl -s -o /dev/null -w "%{http_code}\n" "https://drejsamudio-hue.github.io/estudio-samudio-landing/docs/superpowers/plans/2026-09-02-auditoria-y-correcciones.html"
```

Esperado: `404`.

---

## Fase 1 — Deploy determinista

### Task 2: Eliminar la carrera de deploys

**Files:**
- Delete: `.github/workflows/pages.yml`

**Interfaces:**
- Consumes: árbol limpio de Task 1.
- Produces: un único deployment por push. Las tareas siguientes dependen de esto, porque si no el resultado de cada verificación es no determinista.

**Contexto de la decisión.** Hay dos caminos y son excluyentes:

- **Opción A (recomendada): borrar `pages.yml`.** Pages ya está en `build_type: legacy` y es quien realmente sirve el sitio. Borrar el workflow elimina la carrera sin tocar ninguna configuración del repo. Los tres plugins en uso (`jekyll-seo-tag`, `jekyll-feed`, `jekyll-sitemap`) están todos en la whitelist de GitHub Pages, así que no se pierde nada.
- **Opción B: cambiar Pages a "GitHub Actions"** (`gh api -X PUT .../pages -f build_type=workflow`). Da libertad de plugins a futuro, pero **es un cambio de configuración del repositorio y requiere autorización explícita del Dr. Samudio antes de ejecutarlo.** No la ejecutes por tu cuenta.

Este plan asume Opción A. Si el Dr. prefiere B, esta tarea cambia entera.

- [ ] **Step 1: Registrar el estado actual, para poder comparar después**

```bash
gh api repos/drejsamudio-hue/estudio-samudio-landing/pages --jq '{build_type,source}'
```

Esperado: `{"build_type":"legacy","source":{"branch":"main","path":"/"}}`. Si `build_type` ya no es `legacy`, **detenerse**: alguien cambió la configuración y este plan hay que reevaluarlo.

- [ ] **Step 2: Borrar el workflow**

```bash
git rm .github/workflows/pages.yml
```

- [ ] **Step 3: Commit**

```bash
git commit -m "chore(ci): elimina pages.yml — Pages usa build legacy y los dos deploys competian

El workflow reportaba success pero no publicaba: build_type=legacy significa
que el build por rama es el que sirve el sitio. Dos deployments por push, ~6s
de diferencia, ganaba el ultimo de forma no determinista.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

- [ ] **Step 4: Push y esperar**

```bash
git push && sleep 75
```

(`gh run watch` ya no sirve acá: el workflow custom dejó de existir y el build legacy no aparece como run.)

- [ ] **Step 5: Verificar que ahora hay UN solo deployment**

```bash
gh api "repos/drejsamudio-hue/estudio-samudio-landing/deployments?per_page=3" --jq '.[] | "\(.created_at)  \(.environment)"'
```

Esperado: el deployment más reciente es único para este push. Antes había dos con ~6 s de diferencia; ahora debe haber uno solo.

- [ ] **Step 6: Verificar que el sitio sigue vivo**

```bash
for p in "" "notas/" "notas/aumento-cuota-plan-ahorro/" "sitemap.xml"; do
  echo "$(curl -s -o /dev/null -w '%{http_code}' "https://drejsamudio-hue.github.io/estudio-samudio-landing/$p")  /$p"
done
```

Esperado: `200` en las cuatro. Si alguna da 404, revertir de inmediato: `git revert HEAD && git push`.

---

## Fase 2 — Corregir las 16 páginas de contenido

### Task 3: Eliminar el canonical duplicado

**Files:**
- Modify: `_layouts/default.html:22-24`

**Interfaces:**
- Consumes: deploy determinista de Task 2.
- Produces: exactamente 1 `<link rel="canonical">` por página.

- [ ] **Step 1: Confirmar el defecto en producción antes de tocar nada**

```bash
curl -s "https://drejsamudio-hue.github.io/estudio-samudio-landing/notas/aumento-cuota-plan-ahorro/" | grep -c '<link rel="canonical"'
```

Esperado: `2`. Ese es el bug.

- [ ] **Step 2: Borrar el bloque redundante**

En `_layouts/default.html`, eliminar estas tres líneas (22–24):

```liquid
{% if page.url == "/notas/" or page.layout == "post" %}
<link rel="canonical" href="{{ page.url | absolute_url }}">
{% endif %}
```

`{% seo %}` en la línea 6 ya emite el canonical correcto. No agregar nada en reemplazo.

- [ ] **Step 3: Confirmar que `{% seo %}` sigue presente**

```bash
grep -n "{% seo %}" _layouts/default.html
```

Esperado: `6:{% seo %}`. Si no aparece, no borrar el bloque anterior — sería quedarse sin canonical.

- [ ] **Step 4: Commit y push**

```bash
git add _layouts/default.html
git commit -m "fix(seo): elimina canonical duplicado — jekyll-seo-tag ya lo emite

Afectaba a /notas/ y a las 13 notas: dos <link rel=canonical> por pagina.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
git push && sleep 75
```

- [ ] **Step 5: Verificar que ahora hay uno solo, y que apunta bien**

```bash
for u in "notas/" "notas/aumento-cuota-plan-ahorro/" "quien-soy/"; do
  n=$(curl -s "https://drejsamudio-hue.github.io/estudio-samudio-landing/$u" | grep -c '<link rel="canonical"')
  echo "canonicals=$n  /$u"
  curl -s "https://drejsamudio-hue.github.io/estudio-samudio-landing/$u" | grep -oE '<link rel="canonical"[^>]*>'
done
```

Esperado: `canonicals=1` en las tres, y cada href apuntando a su propia URL absoluta con `/estudio-samudio-landing/` incluido.

---

### Task 4: Portar la carga asíncrona de fuentes a `default.html`

**Files:**
- Modify: `_layouts/default.html:19-21`

**Interfaces:**
- Consumes: `_layouts/default.html` ya corregido en Task 3.
- Produces: fuentes no bloqueantes con `display=optional` en las 16 páginas de contenido, replicando lo que `index.html` ya hace.

- [ ] **Step 1: Ver el estado actual**

```bash
grep -nE "fonts\.googleapis|preconnect" _layouts/default.html
```

Esperado: línea 21 con `rel="stylesheet"` y `display=swap` — render-blocking.

- [ ] **Step 2: Reemplazar el bloque de fuentes**

En `_layouts/default.html`, reemplazar las líneas 19–21:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800&family=Inter:wght@400;600&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet">
```

por esto (idéntico a `index.html:53-56`):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" media="print" onload="this.media='all'" href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800&family=Inter:wght@400;600&family=IBM+Plex+Mono:wght@400;600&display=optional">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800&family=Inter:wght@400;600&family=IBM+Plex+Mono:wght@400;600&display=optional"></noscript>
```

Dos cambios: el truco `media="print" onload` (descarga sin bloquear el render) y `display=optional` en lugar de `swap` (elimina el salto de texto que genera CLS). El `<noscript>` cubre a quien tenga JS deshabilitado.

- [ ] **Step 3: Commit y push**

```bash
git add _layouts/default.html
git commit -m "perf(layout): fuentes async y display=optional en default.html

Los commits 0acd2e0 y 5cc1489 aplicaron esto solo a index.html. Las 16
paginas de contenido seguian con stylesheet bloqueante y display=swap.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
git push && sleep 75
```

- [ ] **Step 4: Verificar en producción**

```bash
curl -s "https://drejsamudio-hue.github.io/estudio-samudio-landing/notas/aumento-cuota-plan-ahorro/" | grep -oE 'fonts\.googleapis[^"]*|media="print"|<noscript>'
```

Esperado: aparece `media="print"`, aparece `<noscript>`, y las URLs de fuentes terminan en `display=optional`. **No** debe quedar ningún `display=swap`.

- [ ] **Step 5: Confirmar que las fuentes efectivamente se aplican**

Abrir `https://drejsamudio-hue.github.io/estudio-samudio-landing/notas/aumento-cuota-plan-ahorro/` en el navegador y confirmar que los títulos siguen en la serif del sitio y no en la fuente por defecto del sistema. `display=optional` significa que si la fuente tarda demasiado el navegador usa la de sistema y no la cambia — verificar que en una carga normal se ve bien.

---

### Task 5: Diferir gtag en `default.html`

**Files:**
- Modify: `_layouts/default.html:11-18`

**Interfaces:**
- Consumes: `_layouts/default.html` de Task 4.
- Produces: GA4 cargado tras el render en las 16 páginas, con el mismo measurement ID.

- [ ] **Step 1: Ver el bloque actual**

```bash
grep -n -B2 -A8 "googletagmanager" _layouts/default.html
```

- [ ] **Step 2: Reemplazar el bloque de gtag**

En `_layouts/default.html`, reemplazar:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-LTD1RWM91T"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-LTD1RWM91T', { anonymize_ip: true });
</script>
```

por:

```html
<!-- Google tag (gtag.js) — diferido hasta despues del render -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-LTD1RWM91T', { anonymize_ip: true });
  window.addEventListener('load', function () {
    var s = document.createElement('script');
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-LTD1RWM91T';
    s.async = true;
    document.head.appendChild(s);
  });
</script>
```

La cola `dataLayer` se define de entrada, así que cualquier `gtag('event', ...)` que ocurra antes de que cargue el script queda encolado y se procesa cuando llega. El script pesado recién se pide en el evento `load`.

- [ ] **Step 3: Commit y push**

```bash
git add _layouts/default.html
git commit -m "perf(layout): difiere gtag hasta window.load en default.html

Mismo tratamiento que index.html recibio en 0acd2e0. El measurement ID
G-LTD1RWM91T no cambia y dataLayer se define antes, asi que no se pierden
eventos disparados temprano.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
git push && sleep 75
```

- [ ] **Step 4: Verificar que el ID sigue ahí y el script ya no está en el head estático**

```bash
curl -s "https://drejsamudio-hue.github.io/estudio-samudio-landing/notas/aumento-cuota-plan-ahorro/" | grep -cE '<script async src="https://www\.googletagmanager\.com'
curl -s "https://drejsamudio-hue.github.io/estudio-samudio-landing/notas/aumento-cuota-plan-ahorro/" | grep -c "G-LTD1RWM91T"
```

Esperado: `0` en el primero (ya no hay etiqueta estática) y `2` en el segundo (el ID aparece en el `config` y en el `s.src`).

- [ ] **Step 5: Verificar que GA4 realmente registra la visita**

Este es el paso que importa y no se puede hacer con `curl`. Abrir GA4 → Informes → **Tiempo real**, luego visitar `https://drejsamudio-hue.github.io/estudio-samudio-landing/notas/aumento-cuota-plan-ahorro/` desde el navegador y confirmar que la visita aparece dentro de ~30 s.

Si **no** aparece: revertir con `git revert HEAD && git push` y reportarlo. No dejar analítica rota en las 16 páginas de contenido por una optimización de performance.

---

## Fase 3 — Sitemap sostenible

### Task 6: Agregar `/notas/` al sitemap

Corrección inmediata de B5, independiente de la decisión de Task 7.

**Files:**
- Modify: `sitemap.xml`

**Interfaces:**
- Produces: sitemap con 17 URLs.

- [ ] **Step 1: Confirmar que falta, y recuperar la entrada original**

```bash
curl -s "https://drejsamudio-hue.github.io/estudio-samudio-landing/sitemap.xml" | grep -c "estudio-samudio-landing/notas/</loc>"
```

Esperado: `0` — confirmado el hueco.

La entrada existió y se perdió en `61669b7`. Para ver cómo estaba antes:

```bash
git show 29adad7:sitemap.xml | grep -A4 "landing/notas/</loc>"
```

- [ ] **Step 2: Agregar la entrada**

En `sitemap.xml`, en el bloque `<!-- Páginas estáticas -->`, insertar antes de la entrada de `quien-soy`:

```xml
  <url>
    <loc>https://drejsamudio-hue.github.io/estudio-samudio-landing/notas/</loc>
    <lastmod>2026-09-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
```

`priority` 0.9 y `changefreq` weekly porque es el índice: cambia cada vez que se publica una nota y es la puerta de entrada a las 13.

- [ ] **Step 3: Verificar que no se rompió el front matter al editar**

```bash
head -4 sitemap.xml
```

Esperado: las mismas 4 líneas del Task 1, Step 3, con `---` y `<?xml` **en líneas separadas**. Este es el error que ya ocurrió una vez.

- [ ] **Step 4: Commit y push**

```bash
git add sitemap.xml
git commit -m "fix(sitemap): agrega /notas/ — faltaba el indice de notas

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
git push && sleep 75
```

- [ ] **Step 5: Verificar en producción**

```bash
curl -s -o /tmp/sm.xml -w "HTTP %{http_code} | %{content_type}\n" "https://drejsamudio-hue.github.io/estudio-samudio-landing/sitemap.xml"
head -1 /tmp/sm.xml
grep -c "<loc>" /tmp/sm.xml
grep -c "estudio-samudio-landing/notas/</loc>" /tmp/sm.xml
```

Esperado: `HTTP 200 | application/xml`, primera línea `<?xml ...`, `17` URLs, y `1` para `/notas/`.

- [ ] **Step 6: Reenviar el sitemap a Search Console**

En Search Console → Sitemaps, reenviar `https://drejsamudio-hue.github.io/estudio-samudio-landing/sitemap.xml` para que Google recoja la nueva URL.

---

### Task 7 (DECISIÓN): Volver a `jekyll-sitemap` automático

**No ejecutar sin confirmación del Dr. Samudio.** El sitemap manual hoy funciona; esta tarea cambia algo que no está roto, a cambio de eliminar la deuda que causó B5 y buena parte del churn.

**El caso a favor:** el comentario en `_config.yml` que justificó deshabilitar el plugin ("genera URLs relativas") es incorrecto. `jekyll-sitemap` produce URLs absolutas cuando `url` y `baseurl` están definidos, y acá lo están (`url: https://drejsamudio-hue.github.io`, `baseurl: /estudio-samudio-landing`). El plugin está en la whitelist de GitHub Pages y ya figura en el `Gemfile`. Con él, cada nota nueva entra al sitemap sola.

**El caso en contra:** se pierden los `lastmod` y `priority` curados a mano. `jekyll-sitemap` usa la fecha del post o el mtime del archivo, y no emite `priority` ni `changefreq`. Google trata ambos como sugerencias débiles, así que la pérdida real es menor — pero es una pérdida.

**Files:**
- Delete: `sitemap.xml`
- Modify: `_config.yml` (descomentar el plugin)

- [ ] **Step 1: Guardar una copia de rescate fuera del árbol**

```bash
cp sitemap.xml "$TEMP/sitemap-manual-backup.xml" && ls -la "$TEMP/sitemap-manual-backup.xml"
```

- [ ] **Step 2: Anotar el commit de rollback**

```bash
git rev-parse --short HEAD
```

Guardar ese hash. Si algo sale mal, el rollback es `git revert <hash-del-commit-de-esta-tarea>`.

- [ ] **Step 3: Habilitar el plugin**

En `_config.yml`, reemplazar el bloque:

```yaml
plugins:
  # jekyll-sitemap deshabilitado: genera URLs relativas que Search Console no resuelve.
  # Se usa sitemap.xml manual con URLs absolutas (ver raíz del repo).
  # - jekyll-sitemap
  - jekyll-seo-tag
  - jekyll-feed
```

por:

```yaml
plugins:
  # jekyll-sitemap genera URLs absolutas usando url + baseurl (ambos definidos arriba).
  # El sitemap.xml manual se eliminó: obligaba a editar XML a mano por cada nota
  # y ya provocó que /notas/ quedara fuera del índice.
  - jekyll-sitemap
  - jekyll-seo-tag
  - jekyll-feed
```

- [ ] **Step 4: Eliminar el sitemap manual**

`jekyll-sitemap` **no genera nada si ya existe un `sitemap.xml`**. Mientras el archivo esté, el plugin es un no-op. Hay que borrarlo:

```bash
git rm sitemap.xml
```

- [ ] **Step 5: Commit y push**

```bash
git add _config.yml
git commit -m "refactor(sitemap): vuelve a jekyll-sitemap automatico

El motivo original para deshabilitarlo (URLs relativas) era incorrecto: el
plugin usa url + baseurl, ambos definidos en _config.yml. El sitemap manual
exigia editar XML por cada nota y ya dejo /notas/ afuera.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
git push && sleep 75
```

- [ ] **Step 6: Verificar el sitemap generado**

```bash
curl -s -o /tmp/sm2.xml -w "HTTP %{http_code} | %{content_type}\n" "https://drejsamudio-hue.github.io/estudio-samudio-landing/sitemap.xml"
head -3 /tmp/sm2.xml
grep -c "<loc>" /tmp/sm2.xml
grep -c "drejsamudio-hue.github.io/estudio-samudio-landing/" /tmp/sm2.xml
```

Esperado: `HTTP 200 | application/xml`; al menos `17` URLs; y el conteo de URLs absolutas **igual** al conteo de `<loc>` — si son distintos, hay URLs relativas y el plugin no sirve acá.

- [ ] **Step 7: Verificar que todas las URLs generadas resuelven**

```bash
grep -oE 'https://[^<]*' /tmp/sm2.xml | while read u; do echo "$(curl -s -o /dev/null -w '%{http_code}' "$u")  $u"; done
```

Esperado: `200` en todas. Cualquier `404` significa que el plugin inventó una URL que no existe.

- [ ] **Step 8: Decidir con la evidencia a la vista**

Si los Steps 6 y 7 pasan limpios, la tarea está lista: reenviar el sitemap en Search Console.

Si aparecen URLs relativas o algún 404, **revertir**:

```bash
git revert HEAD && git push
```

El sitemap manual vuelve tal cual y no se pierde nada. Reportar exactamente qué falló.

---

## Fuera de alcance (registrado, no planificado)

- **Interlinking:** `index.html` enlaza solo a `/notas/`; las 13 notas quedan a dos clics de la home. Funciona, pero concentra toda la autoridad interna en una sola página. Vale una decisión editorial aparte sobre destacar 3–4 notas pilar en la landing.
- **Dominio propio:** `_config.yml` y `robots.txt` ya tienen documentado el cambio a `estudiosamudio.com.ar`. Cuando se haga, `url`/`baseurl` y la línea `Sitemap:` son los dos únicos puntos a tocar.

---

## Orden de ejecución y por qué

1. **Task 1** primero y sin excepción: hay una regresión sin commitear que puede republicar el bug del sitemap.
2. **Task 2** segundo: mientras haya dos deploys compitiendo, ninguna verificación de las tareas siguientes es confiable.
3. **Tasks 3, 4, 5** tocan todas `_layouts/default.html`. Ejecutarlas en orden evita conflictos de edición sobre las mismas líneas.
4. **Task 6** es independiente y de bajo riesgo.
5. **Task 7** al final, solo con visto bueno explícito, y solo con todo lo demás estable.
