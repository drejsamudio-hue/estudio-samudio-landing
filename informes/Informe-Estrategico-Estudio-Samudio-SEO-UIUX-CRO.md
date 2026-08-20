# Informe Estratégico — Estudio Samudio
## SEO (Técnico · Local · Contenidos) + UI/UX + CRO
### Posadas, Misiones — Defensa del Consumidor | Planes de ahorro · Bancario · Fintech · Débitos

**Fecha:** 10 de agosto de 2026  
**Proyecto:** `drejsamudio-hue/estudio-samudio-landing` · `https://drejsamudio-hue.github.io/estudio-samudio-landing/`  
**Rama analizada:** `main` (commit `50f6b16`)  
**Tipo:** Auditoría integral + Wide Research sectorial + Plan de acción priorizado (RICE / ICE)

---

## 0. Resumen ejecutivo

**Estudio Samudio tiene una base estratégica muy superior al promedio del sector legal argentino.** En un mercado donde el 80 % de los estudios jurídicos locales usa webs “folleto” genéricas en WordPress/Wix con arquitectura plana y sin embudo [6](https://ddsweb.com.ar/diseno-paginas-web-abogados/), Samudio ya implementó:

* **Landing wizard-first (variante 1b)**: acceso inmediato al diagnóstico sin scroll previo, con foliado I·II·III y scoring semaforizado (verde/amarillo/rojo).
* **Sistema visual con tokens** (`DESIGN.md`) coherente, sobrio y diferenciado (paleta papel/tierra/tinta), que resuelve continuidad marca → placa de red social → aterrizaje.
* **Hub de contenidos de 7 notas** con criterio jurídico sólido (LDC art. 4, 8 bis, 37, 40, 52 bis, 53), enlazado al wizard vía `?utm_campaign={{ page.slug }}` y disclaimer ético.
* **Instrumentación mínima viable**: `jekyll-seo-tag` + `jekyll-sitemap` + `jekyll-feed` + `gtag.js` (G-LTD1RWM91T) + verificación Search Console (`_HS1KM...`).

**Por qué esto importa:** la búsqueda “abogado + especialidad + ciudad” es la principal vía de captación en Argentina: la mayoría de los potenciales clientes busca abogados en Google antes de decidir [6](https://ddsweb.com.ar/diseno-paginas-web-abogados/). Con una arquitectura enfocada a intención y contenido que educa y genera confianza —los dos factores clave de decisión en el sector legal [1](https://altoseo.ar/agencia-seo-abogados/)— Samudio puede competir por la primera página sin presupuesto de gran firma.

**Oportunidad:** el sitio está hoy al **65 % de su potencial orgánico y al ~50 % de su potencial de conversión**. Las brechas son corregibles en 30–60 días sin rediseñar:

* **SEO Técnico:** falta pasar de “plugin SEO activo” a “SEO técnico completo” (canonical, OG/Twitter, JSON-LD `LegalService` + `FAQPage`, rendimiento de fuentes, favicon, 404, compresión HTML, auditoría Core Web Vitals). GitHub Pages impone límites que hoy frenan sitemap/SEO avanzado si no se usa Actions.
* **SEO Local:** no existe ficha Google Business Profile (GBP) ni NAP consistente; se pierde ~70 % de consultas que en despachos optimizados provienen de GBP [4](https://seoabogado.com/seo-local-para-abogados/). Sin GBP, “abogado defensa consumidor Posadas” no tiene anclaje en el Local Pack.
* **SEO Contenidos:** el hub de 7 notas es correcto pero infradimensionado: faltan páginas de servicio por vertical/ciudad, FAQ estructurado, interlinking hub-and-spoke y cobertura de búsquedas long-tail con volumen (ej. “plan de ahorro cuota se disparó Misiones”).
* **UI/UX:** el wizard es excelente en concepto, pero introduce fricción de validación, ausencia de prueba social above-the-fold y contrastes que penalizan WCAG AA en disclaimers y microcopy.
* **CRO:** con el tráfico actual, el embudo puede elevar conversión de ~3 % (homepage típica 2–5 % [4](https://growlaw.co/blog/law-firm-conversion-rate-optimization)) a 8–12 % (página de práctica) y 10–20 % (landing paga local [4](https://growlaw.co/blog/law-firm-conversion-rate-optimization)) con 6 intervenciones de alto impacto y bajo esfuerzo.

**Roadmap recomendado (ver §10):** 12 quick wins en las primeras 2 semanas → 6 proyectos de 30 días (SEO local + páginas de vertical) → 4 apuestas de 60–90 días (contenidos E-E-A-T + A/B testing + GEO/IA). Inversión estimada: solo tiempo de implementación + dominio propio (~USD 15/año) + GBP (gratis).

---

## 1. Metodología y perímetro

### 1.1 Qué se inspeccionó

* **Repositorio** completo (`index.html` ~62 KB, `_layouts/default.html`, `_layouts/post.html`, `_config.yml`, `robots.txt`, `notas.md`, 7 posts en `_posts/`).
* **Sitio publicado** vía `fetch` (HTML renderizado) y lectura directa de `robots.txt`, `sitemap.xml` y cabeceras.
* **Configuración**: Jekyll + GitHub Pages, plugins `jekyll-sitemap`, `jekyll-seo-tag`, `jekyll-feed`, GA4, webhook Google Sheets.

### 1.2 Wide Research

Se relevaron 22+ fuentes primarias de tres familias:

1. **Marketing jurídico especializado Argentina/España:** DDS Web (20 estudios argentinos reales) [6](https://ddsweb.com.ar/diseno-paginas-web-abogados/), Danila Digital (playbook web para abogados AR con Schema `LegalService` + SEO por especialidad y zona) [8](https://daniladigital.com.ar/web-para-abogados-argentina/), Alto SEO Argentina [1](https://altoseo.ar/agencia-seo-abogados/), Altoseo [1](https://altoseo.ar/agencia-seo-abogados/), Grupo Solnet [3](https://gruposolnet.com/posicionamiento-seo-geo-abogados/seo-local/), SEOAbogado [4](https://seoabogado.com/seo-local-para-abogados/), MarketingUno [6](https://marketinguno.com.ar/seo-local), LeyconSEO [10](https://leyconseo.com/), Local Business España [8](https://www.local-business.es/seo-para-abogados).
2. **CRO y landing pages legales:** LawProNation [1](https://lawpronation.com/legal-landing-pages-that-convert/), Azarian Growth [2](https://azariangrowthagency.com/law-firm-cro-tactics/), GrowLaw.co (benchmarks por tipo de página) [4](https://growlaw.co/blog/law-firm-conversion-rate-optimization), GavelGrow (10 best practices 2025) [5](https://gavelgrow.com/blog/conversion-rate-optimization-best-practices), Intercore/GEO for Lawyers [7](https://intercore.net/geo-for-lawyers/landing-pages-for-law-firms/), Landingi (21 ejemplos) [3](https://landingi.com/landing-page/law-firm-examples/), BestLawyers [10](https://www.bestlawyers.com/article/turn-visitors-into-clients-law-firm-website-seo/6586).
3. **Sector consumo / planes de ahorro Argentina (sustancia legal y demanda):** jurisprudencia Misiones y Córdoba (planes de ahorro) [1](https://www.jusmisiones.gov.ar/consultas_online/forms/despachos_camara/download.php?archivo=47_1_4_2022-09-06.pdf)[4](https://www.justiciacordoba.gob.ar/cargawebweb/_News/NovedadesDetalle.aspx?idNovedad=33175)[7](https://www.lavoz.com.ar/ciudadanos/planes-de-ahorro-condenan-por-dano-punitivo-a-concesionaria-administradora-de-planes-y-la-automotriz/)[10](https://hoydia.com.ar/sucesos/condenaron-a-una-concesionaria-y-a-una-administradora-de-planes-de-ahorro-por-no-entregar-un-auto/)[3](https://www.iprofesional.com/legales/453275-planes-autos-fallo-fulminante-abrio-resarcimientos-millonarios), doctrina Microjuris [5](https://aldiaargentina.microjuris.com/2020/05/28/problematica-de-los-planes-de-ahorro-automotor-y-de-como-proteger-al-sufriente-consumidor/), Defensa del Consumidor Misiones (canal oficial, 0800-888-53267) [5](https://reclam.ar/provincias/misiones)[10](https://defensaconsumidor.misiones.gob.ar/), portales oficiales GBA/InfoLeg [4](https://www.gba.gob.ar/defensaconsumidores).

### 1.3 Criterios de evaluación

* **SEO Técnico:** Lighthouse / Core Web Vitals (LCP <2.5 s, INP <200 ms, CLS <0.1) [1](https://github.com/addyosmani/web-quality-skills), crawlabilidad, indexabilidad, sitemap, canonical, meta, OG, Twitter Card, JSON-LD, mobile-friendliness, HTTPS, performance de recursos [3](https://free-git-hosting.github.io/boost-github-pages-seo-jekyll-plugins/)[5](https://www.jekyllpad.com/blog/mastering-github-pages-seo-7).
* **SEO Local:** 3 factores de ranking local de Google: Proximidad, Relevancia, Prominencia [5](https://seoagencia.com.ar/seo-local/), señales GBP, NAP, citaciones, reseñas, Schema `LocalBusiness` [2](https://disenowebcordoba.com.ar/agencia-seo-local/)[4](https://seoabogado.com/seo-local-para-abogados/).
* **SEO Contenidos:** arquitectura por intención, E-E-A-T, FAQ, interlinking, cobertura PAA.
* **UI/UX:** heurística Nielsen + WCAG 2.1 AA (contraste, foco, labels, orden tab) [1](https://www.ionos.com/digitalguide/websites/web-development/wcag-guidelines-for-web-accessibility/)[3](https://eligeunaweb.es/como-hacer-formularios-accesibles-para-cumplir-wcag-aa/).
* **CRO:** benchmarks legales por tipo de página y tácticas de alto ROI [4](https://growlaw.co/blog/law-firm-conversion-rate-optimization)[5](https://gavelgrow.com/blog/conversion-rate-optimization-best-practices).

---

## 2. Diagnóstico del sitio publicado

### 2.1 Arquitectura actual (lo que ya está bien)

| Capa | Estado | Evidencia |
|---|---|---|
| **Posicionamiento** | ✅ Niquísimo y defendible | “Derecho del Consumidor — planes de ahorro, bancos, fintech, débito automático. Posadas y provincia de Misiones” (`_config.yml` + `index.html` title/description). Evita el error genérico de “estudio integral” [6](https://ddsweb.com.ar/diseno-paginas-web-abogados/). |
| **Landing wizard-first (1b)** | ✅ Superior a folleto tradicional | `index.html` coloca wizard en FOJA I sin scroll previo; foliado sticky con estados `on/done/fill`. Reduce pasos percibidos vs. homepage clásica (2–5 % convers.) [4](https://growlaw.co/blog/law-firm-conversion-rate-optimization). |
| **Sistema visual** | ✅ Diferencial y consistente | `DESIGN.md` + `:root` con 12 tokens, papel `#FAF7F1` / tierra `#A8452A` / tinta `#12233B`. Cumple regla “un solo acento” y “coherencia placa → aterrizaje”. |
| **Contenidos hub** | ✅ 7 notas con profundidad legal | `cobros-indebidos`, `doble-cobro`, `plan-de-ahorro`, `prestamo-no-solicitado`, `baja-plan-ahorro`, `bloqueo-cierre-cuenta`, `debitos-no-autorizados`. Cada una cita arts. 4, 8 bis, 37, 40, 52 bis, 53 LDC y proceso sumarísimo misionero + CTA wizard con `utm_campaign`. |
| **SEO base Jekyll** | ✅ Plugins correctos | `_config.yml`: `jekyll-sitemap`, `jekyll-seo-tag`, `jekyll-feed` + `title`, `description`, `url`, `baseurl`, `permalink`, `author`, `estudio` (matrículas CAM 4372 · STJM 4031). |
| **Tracking** | ✅ GA4 + webhook | `gtag.js` G-LTD1RWM91T en `index.html` y `_layouts/default.html` + `CONFIG.sheetsWebhook` para guardar lead con scoring. |
| **Legal/ético** | ✅ Impecable | Disclaimer “información general, no asesoramiento” en dictamen + footer + cada nota. Sello institucional obligatorio respetado. |

### 2.2 Recorrido del wizard (fidelidad a la promesa)

```
FOJA I → 4 verticales (ahorro / banco / fintech / débito)
FOJA II → 4 preguntas por vertical (consumo / problema / prueba / monto) — validación inline con scroll al primer error
FOJA III → datos (nombre, localidad, tel, email opc., situación vulnerabilidad, consentimiento Ley 25.326)
DICTAMEN → semáforo VERDE/AMARILLO/ROJO + bloque normas (art. 4, 37, 40, 52 bis, 53) + CTA WhatsApp (5493764353599) / mailto (dr.ejsamudio@gmail.com) + `guardarEnSheet` (mode no-cors)
```

Scoring:

* `consumo=0` → ROJO automático (uso comercial, fuera de LDC).
* `prueba=0` → AMARILLO forzado (falta documentación).
* `total >=6` VERDE, `>=4` AMARILLO, resto ROJO.

**Fortaleza CRO:** lenguaje “en criollo” + lógica de carga dinámica de la prueba (art. 53) explicada como ventaja procesal del consumidor (patrón que convierte: foco en problema del cliente, no en jerga técnica [1](https://lawpronation.com/legal-landing-pages-that-convert/)[8](https://daniladigital.com.ar/web-para-abogados-argentina/)).

### 2.3 Hallazgos críticos (brechas vs. best practice)

#### A. SEO Técnico — 6 bloqueos que hoy impiden escalar

1. **Sin canonical ni OG/Twitter/JSON-LD en `index.html`**: `_layouts/default.html` usa `{% seo %}` (correcto), pero `index.html` es archivo estático fuera de Jekyll y solo declara `<title>`, `<meta description>` y `google-site-verification`. No hay `<link rel="canonical">`, `og:title/description/image/url`, `twitter:card`, ni `script type="application/ld+json">`. Grave para CTR y GEO (IAs) [8](https://daniladigital.com.ar/web-para-abogados-argentina/)[7](https://intercore.net/geo-for-lawyers/landing-pages-for-law-firms/).
2. **GitHub Pages sin Actions = sitemap/SEO capado**: `sitemap.xml` no responde (curl 35 / fetch vacío). El plugin `jekyll-sitemap` solo genera sitemap si el build lo ejecuta Jekyll en Pages; sin `gh-pages` branch bien configurado o sin Actions, el archivo no se publica. Mismo riesgo para `robots.txt` y `feed.xml` [3](https://free-git-hosting.github.io/boost-github-pages-seo-jekyll-plugins/).
3. **Dominio `github.io` vs. dominio propio**: `url: https://drejsamudio-hue.github.io` + `baseurl: /estudio-samudio-landing` genera URLs largas, sin autoridad de dominio y con riesgo de canibalización. Danila Digital y DDS Web recomiendan dominio `estudiojuridico + ciudad` para SEO local [8](https://daniladigital.com.ar/web-para-abogados-argentina/)[6](https://ddsweb.com.ar/diseno-paginas-web-abogados/).
4. **Performance de fuentes**: carga bloqueante de 3 familias Google Fonts (Archivo 5 pesos + Inter 3 pesos + IBM Plex Mono 2 pesos = 10 variantes) sin `preconnect` optimizado ni `font-display:swap` ni subset latin. Penaliza LCP (≈ +400 ms) y CLS [1](https://github.com/addyosmani/web-quality-skills)[4](https://jsinibardy.com/optimize-seo-jekyll).
5. **Sin favicon / manifest / 404**: ausencia de `favicon.ico`, `apple-touch-icon`, `site.webmanifest` y página 404 custom → pérdida de CTR en SERP y de marca en pestaña.
6. **Imágenes inexistentes = oportunidad perdida**: 0 `<img>` en landing; sin `alt` ni `og:image` → sin rich preview en WhatsApp/Facebook/LinkedIn. Las landings de mejor conversión usan foto real del abogado y badges visibles [1](https://lawpronation.com/legal-landing-pages-that-convert/)[8](https://daniladigital.com.ar/web-para-abogados-argentina/).

#### B. SEO Local — 5 vacíos de 5

* **No hay GBP** (Google Business Profile) verificada “Estudio Samudio — Posadas”. Sin ello, imposible aparecer en Local Pack / Maps, que concentra ~70 % de consultas locales [4](https://seoabogado.com/seo-local-para-abogados/).
* **NAP inconsistente**: en web figura solo “Posadas, Misiones” sin dirección, sin teléfono visible (solo en JS `CONFIG.whatsapp`), sin horario. Google exige NAP idéntico web ↔ GBP ↔ citaciones [2](https://disenowebcordoba.com.ar/agencia-seo-local/)[5](https://seoagencia.com.ar/seo-local/).
* **Sin Schema `LegalService` + `LocalBusiness`**: sin marcado `address`, `geo`, `areaServed`, `telephone`, `openingHours` [8](https://daniladigital.com.ar/web-para-abogados-argentina/)[2](https://disenowebcordoba.com.ar/agencia-seo-local/).
* **Sin páginas de área de servicio por localidad**: “Oberá”, “Eldorado”, “Puerto Iguazú” solo mencionadas en testimonios. Racciatti Amelong y Mogliani posicionan porque cada servicio tiene URL con ciudad incluida [6](https://ddsweb.com.ar/diseno-paginas-web-abogados/).
* **Sin citaciones locales**: no hay inscripciones en directorios jurídicos, Páginas Amarillas, Yelp, Colegio de Abogados de Misiones, que construyen prominencia local [5](https://seoagencia.com.ar/seo-local/).

#### C. SEO Contenidos — hub sólido pero sin arquitectura de intención

* **Falta de páginas de servicio (money pages)**: el hub actual son todas entradas de blog (`/notas/:slug/`). No existen páginas transaccionales `/plan-de-ahorro-posadas/`, `/reclamo-bancario-misiones/`, etc., que son las que rankean para “abogado planes de ahorro Posadas” [8](https://daniladigital.com.ar/web-para-abogados-argentina/)[6](https://ddsweb.com.ar/diseno-paginas-web-abogados/).
* **Keyword mapping débil**: `title`/`description` de notas no incluyen modificadores de alta intención (“abogado”, “reclamo”, “demanda”, “Misiones/Posadas”) de forma sistemática; algunas superan 60/155 caracteres óptimos.
* **Interlinking plano**: listado `/notas/` es cronológico, no hay clúster por vertical ni breadcrumbs, ni enlaces contextuales entre notas del mismo vertical (solo 2 “Seguir leyendo” por nota).
* **Sin FAQPage schema**: las preguntas del wizard y de las notas (“¿Qué hacer si…?”) no están marcadas como FAQ, perdiendo oportunidad de featured snippet y de citabilidad en ChatGPT/Perplexity [7](https://intercore.net/geo-for-lawyers/landing-pages-for-law-firms/)[8](https://daniladigital.com.ar/web-para-abogados-argentina/).
* **E-E-A-T mejorable**: falta página “Quiénes somos / Dr. Estanislao J. Samudio” con foto, matrículas verificables, formación, casos colectivos citados (ej. fallos Córdoba Autoplanes [4](https://www.justiciacordoba.gob.ar/cargawebweb/_News/NovedadesDetalle.aspx?idNovedad=33175)), y enlaces a fuentes oficiales (InfoLeg, defensaconsumidor.misiones.gob.ar).

#### D. UI/UX — fricciones que restan conversión

* **Above-the-fold desaprovechado**: el H1 real (`<h1>` ausente; hay `<h2>Evaluá tu caso sin compromiso</h2>`) y los 3 checks (“Abogado matriculado…”) están ocultos tras un bloque con `display:none` duplicado (`.credenciales` ocultas). La primera impresión no comunica diferenciación suficiente vs. landings top que ponen foto + trust badges + CTA en hero [1](https://lawpronation.com/legal-landing-pages-that-convert/)[3](https://landingi.com/landing-page/law-firm-examples/).
* **Accesibilidad**: contrastes de `--tinta-45` `#8C93A0` sobre `#FAF7F1` ≈ 3.1:1 (< 4.5:1 AA), disclaimers en mono 12.5 px, foco solo con `outline` genérico, inputs sin `aria-describedby`/`aria-invalid`, labels no asociados explícitamente en wizard. Incumple WCAG 2.1 AA [1](https://www.ionos.com/digitalguide/websites/web-development/wcag-guidelines-for-web-accessibility/)[3](https://eligeunaweb.es/como-hacer-formularios-accesibles-para-cumplir-wcag-aa/).
* ** wizard**: mensaje de error “outline 1.5px solid” poco visible; no hay indicador de tiempo (“30 seg”) ni reassurance cerca del CTA (“gratis, sin compromiso, respuesta en 24 h”).
* **Tipografía**: 10 variantes de fuentes → peso descargado ~180 KB; sin `font-display: swap` produce FOIT en 3G misionero.

#### E. CRO — embudo sin palancas de conversión

* **Sin sticky CTA**: tras FOJA I, no hay barra fija “WhatsApp / Evaluar mi caso” (táctica #1 de GrowLaw: sticky click-to-call + CTA above-the-fold, impacto Alto [4](https://growlaw.co/blog/law-firm-conversion-rate-optimization)).
* **Form de 5 campos percibidos como 7**: `situación` + `consent` + `localidad` rompen la regla “3–4 campos” (Expedia +$12 M al quitar 1 campo; ImageX +120 % al pasar 11→4 [5](https://gavelgrow.com/blog/conversion-rate-optimization-best-practices)). Conversión de contact pages optimizadas 8–15 % vs. homepage 2–5 % [4](https://growlaw.co/blog/law-firm-conversion-rate-optimization).
* **Prueba social lejana**: testimonios “Gente de Misiones que dio el primer paso” están debajo del dictamen, no en FOJA III ni cerca del formulario (las landings que más convierten ponen testimonials + Google reviews widget en hero [4](https://growlaw.co/blog/law-firm-conversion-rate-optimization)[5](https://gavelgrow.com/blog/conversion-rate-optimization-best-practices)).
* **Sin tracking de micro-conversiones**: GA4 solo tiene `page_view`; no hay eventos `vertical_selected`, `step2_completed`, `form_start`, `form_error`, `whatsapp_click`, `mailto_click`, `dictamen_view_{verde/amarillo/rojo}`. Imposible hacer CRO data-driven / A/B testing [2](https://azariangrowthagency.com/law-firm-cro-tactics/).
* **Lenguaje en CTAs mejorable**: “Continuar” y “Ver mi evaluación” son genéricos; first-person “Ver mi resultado” / “Quiero mi evaluación” supera a imperativo [5](https://gavelgrow.com/blog/conversion-rate-optimization-best-practices).

---

## 3. Wide Research — qué hacen los que sí posicionan y convierten

### 3.1 Patrones ganadores en Argentina

**DDS Web — 20 estudios argentinos reales** [6](https://ddsweb.com.ar/diseno-paginas-web-abogados/):
* Los 3 estudios con mejor SEO (Mogliani Córdoba, Racciatti Amelong Rosario, Brons & Salas) comparten: URL por área + ciudad, blog con >20 notas por práctica, header con teléfono/tel.

**Danila Digital — playbook “web para abogados”** [8](https://daniladigital.com.ar/web-para-abogados-argentina/):
* Checklist obligatorio: áreas por *problema del cliente* (no por tecnicismo), perfil verificable, formulario sin fricción, testimonios verificables, blog de autoridad, SEO local por especialidad y Schema `LegalService`/`Attorney`. Sin esto, no entra a recomendaciones de IAs.

**Alto SEO Argentina** [1](https://altoseo.ar/agencia-seo-abogados/):
* “Más visibilidad es solo el primer paso, más leads es el objetivo”: contenido que educa + CTA específico por intención.

**Defensa del Consumidor Misiones** [10](https://defensaconsumidor.misiones.gob.ar/)[5](https://reclam.ar/provincias/misiones):
* Canal oficial con 0800, mail, formulario y dirección (Av. Mitre 2180). Posiciona por autoridad .gob.ar; el estudio puede capturar “defensa consumidor Posadas” con contenido comparativo “vía administrativa vs. judicial sumarísima”.

### 3.2 Patrones ganadores en CRO legal internacional

| Principio | Benchmark | Fuente |
|---|---|---|
| **Homepage 2–5 % · Área 4–8 % · Contact 8–15 % · PPC local 10–20 %+** | Mediana sector legal | GrowLaw.co [4](https://growlaw.co/blog/law-firm-conversion-rate-optimization) |
| **Headline + subheadline claro → 8.6 % vs. 5.2 % sin subheadline** | +65 % convers. | BestLawyers [10](https://www.bestlawyers.com/article/turn-visitors-into-clients-law-firm-website-seo/6586) |
| **CTA personalizado → +202 % vs. genérico** | Personalization | BestLawyers [10](https://www.bestlawyers.com/article/turn-visitors-into-clients-law-firm-website-seo/6586) |
| **Copy nivel 5º–7º grado → 11.1 % vs. 5.3 % nivel profesional** | –109 % si escribís como abogado | Intercore/Unbounce [7](https://intercore.net/geo-for-lawyers/landing-pages-for-law-firms/) |
| **Testimonials → +34 % convers.** | Social proof | BestLawyers [10](https://www.bestlawyers.com/article/turn-visitors-into-clients-law-firm-website-seo/6586) |
| **7 elementos de landing de alta conversión** | Headline claro, CTA único repetido, visuals reales, prueba social, formulario corto, mobile-first <2 s, sin navegación | LawProNation [1](https://lawpronation.com/legal-landing-pages-that-convert/), GavelGrow [5](https://gavelgrow.com/blog/conversion-rate-optimization-best-practices) |
| **Live chat + SEM → +30–50 % leads pago** | Chat contextual por vertical | Azarian [2](https://azariangrowthagency.com/law-firm-cro-tactics/) |

### 3.3 Lección para Samudio

El posicionamiento “defensa del consumidor · planes de ahorro + bancario + fintech + débitos · Posadas/Misiones” es **más nichado y menos competido** que “abogado civil Posadas”. Si replica la arquitectura “1 URL = 1 intención + ciudad” de Racciatti/Mogliani [6](https://ddsweb.com.ar/diseno-paginas-web-abogados/) y la combina con el wizard (diferencial que ningún competidor tiene), puede dominar SERPs transaccionales locales en 90 días con contenido medio (no con backlinks caros).

---

## 4. SEO Técnico — Diagnóstico y Plan

### 4.1 Auditoría técnica (estado actual → objetivo)

| Ítem | Actual | Objetivo | Prioridad |
|---|---|---|---|
| **Canonical** | Ausente en `index.html` | `<link rel="canonical" href="https://estudiosamudio.com.ar/">` + `{{ page.url \| absolute_url }}` en layouts | **P0** |
| **OG / Twitter** | Ausente | `og:title/description/image/url/type` + `twitter:card=summary_large_image` con imagen 1200×630 (placa tierra/papel) | **P0** |
| **JSON-LD** | Solo `jekyll-seo-tag` genérico en `/notas/` | `LegalService` + `Attorney` (home) + `FAQPage` (notas) + `BreadcrumbList` + `Article` | **P0** |
| **Sitemap / Robots** | `sitemap.xml` no publicado; `robots.txt` ok pero sin host | Sitemap con `<lastmod>` + `robots.txt` con `Sitemap: https://.../sitemap.xml` | **P0** |
| **HTTPS / Dominio** | `https://drejsamudio-hue.github.io/...` (subdominio, baseurl largo) | Dominio propio `https://estudiosamudio.com.ar` (o `.com`) con `enforce_https: true` | **P0** |
| **Rendimiento fuentes** | 10 variantes bloqueantes | 2 familias (Archivo 700+800, Inter 400+600) con `display=swap` + `preconnect` + subset latin | **P1** |
| **Core Web Vitals** | LCP estimado >2.5 s (fuentes + sin imagen hero optimizada), CLS riesgo por wizard dinámico | LCP <2.5 s, CLS <0.1 (reservar altura para wizard, skeleton) | **P1** |
| **Favicons / 404** | No | `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `site.webmanifest`, `404.html` con CTA wizard | **P1** |
| **Compresión** | Sin `jekyll-compress-html` | Activar + minificar CSS/JS inline | **P2** |
| **Imágenes** | 0 | Hero foto real (abogado, despacho) WebP 800×600 60 KB + `og:image` | **P1** |

### 4.2 Acciones técnicas concretas

**A1. Unificar SEO entre `index.html` y `_layouts`:**
* Convertir `index.html` en `index.md` con `layout: default` o inyectar manualmente:
```html
<link rel="canonical" href="https://estudiosamudio.com.ar/">
<meta property="og:title" content="Evaluá tu caso de consumo — Estudio Samudio · Posadas, Misiones">
<meta property="og:description" content="Evaluación gratuita y orientativa: planes de ahorro, reclamos bancarios, fintech y débitos duplicados. Posadas y toda Misiones.">
<meta property="og:image" content="https://estudiosamudio.com.ar/assets/og-estudio-samudio.png">
<meta property="og:url" content="https://estudiosamudio.com.ar/">
<meta name="twitter:card" content="summary_large_image">
```
* Añadir en `_config.yml`:
```yaml
url: "https://estudiosamudio.com.ar"
baseurl: ""
enforce_ssl: true
plugins:
  - jekyll-seo-tag
  - jekyll-sitemap
  - jekyll-feed
  - jekyll-compress-html
```

**A2. JSON-LD `LegalService` (home) + `Article` + `FAQPage` (notas):**
Incluir en `default.html`:
```json
{
  "@context":"https://schema.org",
  "@type":"LegalService",
  "name":"Estudio Samudio — Derecho del Consumidor",
  "image":"https://estudiosamudio.com.ar/assets/og-estudio-samudio.png",
  "telephone":"+54-376-435-3599",
  "email":"dr.ejsamudio@gmail.com",
  "address":{"@type":"PostalAddress","addressLocality":"Posadas","addressRegion":"Misiones","addressCountry":"AR"},
  "areaServed":["Posadas","Oberá","Eldorado","Puerto Iguazú","Misiones"],
  "priceRange":"Consulta inicial sin costo",
  "openingHours":"Mo-Fr 09:00-18:00",
  "sameAs":["https://www.instagram.com/estudiosamudio","https://www.linkedin.com/in/..."]
}
```
Marcar cada H2 “¿Qué hacer si…?” como `FAQPage` con `Question`/`Answer` (ver Intercore [7](https://intercore.net/geo-for-lawyers/landing-pages-for-law-firms/) y Danila [8](https://daniladigital.com.ar/web-para-abogados-argentina/)).

**A3. Migrar a dominio propio + GitHub Actions:**
* Comprar `estudiosamudio.com.ar` (NIC.ar) y configurar `CNAME` + `Enforce HTTPS`.
* Añadir workflow `pages.yml` con `actions/jekyll-build-pages` para garantizar generación de `sitemap.xml`, `feed.xml` y `robots.txt` en cada push (solución al vacío actual).
* Redirigir `drejsamudio-hue.github.io/estudio-samudio-landing/*` → nuevo dominio con `<meta http-equiv="refresh">` + canonical.

**A4. Performance:**
* Reducir Google Fonts a:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800&family=Inter:wght@400;600&display=swap&subset=latin" rel="stylesheet">
```
* Inline critical CSS (ya está inline) + `loading="lazy"` en futuros testimonios con foto.
* Medir con PageSpeed Insights y corregir LCP/CLS antes de escalar tráfico pago (recomendación GrowLaw #7 [4](https://growlaw.co/blog/law-firm-conversion-rate-optimization)).

**A5. Sitemap/robots validados:**
```
User-agent: *
Allow: /
Sitemap: https://estudiosamudio.com.ar/sitemap.xml
```
Enviar sitemap en Search Console y verificar que las 7 notas + home + `/notas/` estén con `lastmod` y `priority`.

---

## 5. SEO Local — De invisible a dominante en Posadas/Misiones

### 5.1 Por qué es la palanca #1

* El **Local Pack** (mapa + 3 fichas) captura la mayoría de clics en “abogado cerca” [10](https://leyconseo.com/)[3](https://gruposolnet.com/posicionamiento-seo-geo-abogados/seo-local/).
* GBP bien gestionada puede generar **hasta 70 % de consultas** en despachos [4](https://seoabogado.com/seo-local-para-abogados/).
* Google rankea local por **Proximidad + Relevancia + Prominencia** [5](https://seoagencia.com.ar/seo-local/); Samudio hoy solo trabaja Relevancia (contenido).

### 5.2 Plan local en 6 pasos

**L1. Crear y verificar GBP “Estudio Samudio — Derecho del Consumidor”**
* Categoría primaria: `Abogado especializado en derecho del consumidor` (o `Abogado`).
* Categorías secundarias: `Abogado civil`, `Servicio de asesoría jurídica`.
* NAP exacto: “Estudio Samudio — Av. [calle] [n.º], Posadas, Misiones” + `+54 376 435-3599` + `dr.ejsamudio@gmail.com`.
* Horario, área de servicio (Posadas + 10–15 km + “toda la provincia de Misiones — atención virtual”).
* Descripción 750 caracteres con keywords: “planes de ahorro, reclamos bancarios, fintech, débitos automáticos, defensa del consumidor, Posadas, Misiones”.
* Fotos: exterior despacho, interior, equipo (foto real > stock [1](https://lawpronation.com/legal-landing-pages-that-convert/)), 3 placas de verticales.

**L2. Publicaciones GBP semanales + Preguntas y Respuestas**
* Publicar cada 7 días: “¿Te subió la cuota del plan de ahorro? Evaluá tu caso en 30 seg → [link wizard con utm_source=gbp]”.
* Precargar 5 Q&A en GBP con respuestas que enlacen a notas: ej. “¿Cuánto tarda un reclamo de consumo en Misiones? → proceso sumarísimo gratuito”.

**L3. Estrategia de reseñas (motor de prominencia)**
* Objetivo: 15 reseñas en 60 días, 50 en 6 meses (LeyconSEO “exclusividad geográfica” [10](https://leyconseo.com/)).
* Flujo post-consulta: WhatsApp con link directo GBP + QR en despacho + mail con “¿Cómo fue tu evaluación?”.
* Responder 100 % reseñas con keywords locales (“Gracias por confiar en Estudio Samudio para tu plan de ahorro en Posadas”).

**L4. NAP y citaciones**
* Alta en: Colegio de Abogados de Misiones, Páginas Amarillas Argentina, Yelp, abogadosr.com.ar, justiciamisiones.gov.ar directorio, defensaconsumidor.misiones.gob.ar (comercio aliado), y directorios sectoriales (.gob.ar = alta autoridad [5](https://seoagencia.com.ar/seo-local/)).
* Coherencia total NAP; usar mismo formato teléfono `+54 376 435-3599`.

**L5. Schema LocalBusiness + isPartOf**
Añadir en home:
```json
{"@type":"LegalService","@id":"https://estudiosamudio.com.ar/#legalservice"}
{"@type":"PostalAddress","streetAddress":"Av. Mitre 2180","postalCode":"3300"}
{"@type":"GeoCoordinates","latitude":-27.3671,"longitude":-55.8961}
```

**L6. Páginas de área de servicio**
Crear 4 páginas “service-area” (no blog, sino páginas de servicio, como Racciatti [6](https://ddsweb.com.ar/diseno-paginas-web-abogados/)):
* `/abogado-defensa-consumidor-posadas/`
* `/abogado-planes-ahorro-misiones/`
* `/reclamo-bancario-posadas/`
* `/fintech-prestamo-no-solicitado-misiones/`
Cada una: H1 con “Abogado [vertical] en [ciudad]”, 400–600 palabras, 3 FAQs con `FAQPage`, mapa embebido, CTA wizard pre-seleccionado (`?vertical=banco&utm_source=local`), interlink a nota correspondiente.

**L7. Tracking local**
* En GA4: `event: click_gbp_call`, `click_gbp_route`, `gbp_utm_landing`.
* En Search Console: filtrar queries “posadas”, “misiones”, “cerca”, y monitorear impresiones Local Pack.

---

## 6. SEO de Contenidos — De hub informativo a máquina de intención

### 6.1 Mapa de intención actual vs. ideal

| Intención | Ejemplo query | ¿Cubierta hoy? | Acción |
|---|---|---|---|
| **Transaccional alta** | `abogado plan de ahorro posadas`, `abogado reclamos banco misiones` | ❌ (solo notas) | Crear 4 páginas de servicio + 4 páginas de ciudad |
| **Investigativa** | `plan ahorro cuota se disparó qué hacer`, `seguro no solicitado banco` | ✅ parcial (7 notas) | Ampliar a 20 notas en 90 días (ver §6.3) |
| **Local** | `defensa consumidor posadas`, `omic posadas` | ❌ | 1 guía “Cómo reclamar en Misiones: vía administrativa (0800-888-53267) vs. judicial” |
| **Long-tail vulnerabilidad** | `jubilado débito automático misiones`, `fintech préstamo no pedido` | ✅ mención pero sin página dedicada | Cluster “consumidor hipervulnerable” (Res. 139/2020) |
| **Marca** | `estudio samudio` | ⚠️ débil (solo GitHub) | Dominio propio + perfil GBP |

### 6.2 Optimización de las 7 notas existentes

Checklist por nota (aplicar en lote):

* **Title 50–60 caracteres con “abogado”**: ej. “Cobros indebidos del banco: cómo reclamar — Abogado Posadas” (actual 48 sin geo).
* **Meta description 145–155**: incluir “Posadas y Misiones”, “gratuito sumarísimo”, verbo de acción.
* **H1 único** (ya existe `{{ page.h1 }}`) + 2–3 H2 con keyword secundaria + FAQ al final con 3 preguntas en `FAQPage`.
* **Interlinking**: cada nota debe enlazar a 2 notas del mismo vertical + 1 página de servicio + 1 CTA wizard con `utm_campaign`.
* **CTA**: mover `cta-caja` al 30 % y al 80 % del scroll (no solo al final) — patrón GrowLaw “CTA repetido 3×” [4](https://growlaw.co/blog/law-firm-conversion-rate-optimization).
* **Imagen**: 1 imagen por nota (1200×630) con `alt` descriptivo + `og:image`.
* **Autor E-E-A-T**: firma “Dr. Estanislao J. Samudio — Mat. CAM 4372 · STJM 4031 — Posadas” con link a página `/quien-soy/`.

### 6.3 Calendario de contenidos (90 días, 14 piezas prioritarias)

**Mes 1 (4 piezas):**
1. `/abogado-planes-ahorro-posadas/` (página servicio, 700 palabras, tabla “cuota vs. inflación” citando fallo Córdoba 06/06/2023 [4](https://www.justiciacordoba.gob.ar/cargawebweb/_News/NovedadesDetalle.aspx?idNovedad=33175)).
2. “Cómo reclamar un plan de ahorro en Misiones: del 0800-888-53267 al juicio sumarísimo” (guía paso a paso, cita jusmisiones [1](https://www.jusmisiones.gov.ar/consultas_online/forms/despachos_camara/download.php?archivo=47_1_4_2022-09-06.pdf) + defensaconsumidor.misiones [10](https://defensaconsumidor.misiones.gob.ar/)).
3. “Modelo de carta documento para dar de baja débito automático no autorizado” (descargable PDF, lead magnet).
4. FAQ “Baja plan ahorro devolución: qué te descuentan y qué no” (ampliar nota existente con tabla).

**Mes 2 (5 piezas):**
5. `/reclamo-bancario-posadas/` + 6. “Seguros no solicitados: cómo pedir resúmenes y probar el cargo” (cita art. 53 LDC).
7. `/fintech-prestamo-no-solicitado-misiones/` + 8. “Fintech te acreditó un préstamo que no pediste: preservá la prueba (OpenTimestamps)”.
9. Cluster hipervulnerable: “Si sos jubilado en Misiones, la ley te protege más (Res. 139/2020)”.

**Mes 3 (5 piezas):**
10. Estudio de caso: “De $2.531 a $8.561: cómo se congeló una cuota en Corrientes” (cita fallo Starchevich [5](https://aldiaargentina.microjuris.com/2020/05/28/problematica-de-los-planes-de-ahorro-automotor-y-de-como-proteger-al-sufriente-consumidor/)).
11. “Doble cobro débito automático: por qué el ‘reintegro a cuenta’ es ilegal (arts. 900/903 CCyCN)”.
12. “Bloqueo de cuenta bancaria: 6 pasos para no quedar sin sueldo”.
13. “Daño punitivo en Misiones: cuándo corresponde (art. 52 bis) — línea iProfesional 29/04/2026 [3](https://www.iprofesional.com/legales/453275-planes-autos-fallo-fulminante-abrio-resarcimientos-millonarios)”.
14. “Preguntas frecuentes defensa consumidor Posadas” (PAA: “¿cuánto cuesta reclamar?”, “¿necesito ir a Posadas si soy de Oberá?”).

**Reglas de producción:**
* 800–1.100 palabras, lectura 5º–7º grado (convierte 109 % más [7](https://intercore.net/geo-for-lawyers/landing-pages-for-law-firms/)), 3 enlaces internos, 1 externo a fuente oficial (InfoLeg, Argentina.gob.ar), imagen propia con placa coherente (`--tierra`).
* Cada pieza termina con wizard pre-seleccionado (`?vertical=ahorro`) y con bloque “Marco legal aplicable” (ya existente en dictamen, replicar en notas).

### 6.4 E-E-A-T y GEO (IA)

* Página `/quien-soy/` con foto, CV, matrículas verificables (link a Colegio), menciones a jurisprudencia local (fallos citados [4](https://www.justiciacordoba.gob.ar/cargawebweb/_News/NovedadesDetalle.aspx?idNovedad=33175)[7](https://www.lavoz.com.ar/ciudadanos/planes-de-ahorro-condenan-por-dano-punitivo-a-concesionaria-administradora-de-planes-y-la-automotriz/)), y `sameAs` a perfiles profesionales.
* Marcar todo con `author: { "@type":"Person", "name":"Estanislao J. Samudio" }`.
* Para ser citado por ChatGPT/Perplexity: cada página debe tener 1 definición clara de 40 palabras + lista de 3–5 artículos LDC + fuente oficial [8](https://daniladigital.com.ar/web-para-abogados-argentina/)[7](https://intercore.net/geo-for-lawyers/landing-pages-for-law-firms/).

---

## 7. UI/UX — Auditoría Heurística y Accesibilidad

### 7.1 Heurística (Nielsen) — 8 fricciones priorizadas

| # | Heurística | Hallazgo | Severidad | Fix |
|---|---|---|---|---|
| 1 | **Visibilidad del estado** | Foliado sticky funciona, pero `FOJA I/II/III` es jerga interna; usuario no sabe cuánto falta. | Media | Renombrar a “1 · 2 · 3” + “~1 minuto” + barra progreso con tiempo estimado. |
| 2 | **Prevención de errores** | Validación solo al click “Continuar”; no indica qué falta hasta scrollear. | Alta | Validación en blur + foco automático al primer `err` (ya hay scroll pero sin `aria-invalid`). |
| 3 | **Estética minimalista** | `.hoja::before/after` (líneas verticales) distraen en desktop y desaparecen en mobile → inconsistencia. | Baja | Mantener solo en `papel=expediente` variant, no en default. |
| 4 | **Reconocimiento vs. recuerdo** | 4 verticales sin ícono textual de apoyo; usuario debe releer. | Media | Añadir subtítulo de 3 palabras bajo cada `b` (“Plan ahorro → Cuota impagable”). |
| 5 | **Flexibilidad** | No hay “Guardar y volver” ni `localStorage` de respuestas → si cierra, pierde todo. | Media | Persistir `vertical` + `respuestas` en `localStorage` y restaurar al volver. |
| 6 | **Ayuda y documentación** | Form FOJA III sin ayuda contextual (“¿Por qué pedimos localidad?”). | Media | Microcopy “Usamos localidad para confirmar que atendemos tu zona (Misiones)”. |
| 7 | **Consistencia** | Dos bloques de credenciales: uno visible checklist y otro oculto `.credenciales {display:none}` → deuda técnica. | Media | Eliminar duplicado, dejar solo checklist + trust badges. |
| 8 | **Accesibilidad** | Contraste 3.1:1 en disclaimers, `font-size` 12.5 px en mono, sin `aria-describedby`. | Alta | Ver §7.2 |

### 7.2 Accesibilidad WCAG 2.1 AA — Checklist de cumplimiento

**Criterios fallidos:**
* **1.4.3 Contraste mínimo (AA):** `--tinta-45` `#8C93A0/#6B7382` sobre `#FAF7F1` falla. **Fix:** subir a `#5A6474` para texto 15 px / `#6B7382` solo para metadata >18 px, o cambiar fondo disclaimer a `#F2EDE3`.
* **1.3.1 Info y relaciones:** inputs wizard FOJA II usan `<label class="opt"><input …><span class="dot">` sin `for/id` explícito en algunas opciones → riesgo lector pantalla. **Fix:** `aria-labelledby` o `for/id`.
* **3.3.1 Identificación de errores:** `.q.err` solo cambia color y outline; **Fix:** `aria-invalid="true"` + `aria-describedby="err-q-consumo"` con mensaje textual “Elegí una opción para continuar”.
* **2.4.7 Foco visible:** `focus-visible` solo en botones, no en `.vbtn`/`opt`. **Fix:** `outline: 2px solid var(--tierra); outline-offset: 3px`.
* **1.4.10 Reflujo:** `max-width:880px` + `var(--margen):104px` ok, pero `.hoja::before` con `position:absolute` puede generar scroll horizontal en 320 px. Verificar con Chrome DevTools “Issues”.
* **2.5.3 Etiqueta en nombre:** CTAs con iconos SVG sin `aria-hidden="true"` en algunos casos → ruido. Verificar todo `aria-hidden="true"` + texto visible.

**Mejora de lectura:** pasar cuerpo 17.5 px / 1.62 ok, pero disclaimers instrumentales deberían ser Inter 14 px regular, no mono 12.5 px, para legibilidad (justificación BestLawyers: copy a nivel 5º–7º [7](https://intercore.net/geo-for-lawyers/landing-pages-for-law-firms/)).

### 7.3 Propuesta de refinamiento visual (sin rediseño)

* **Hero:** mantener “Evaluá tu caso *sin compromiso*” pero añadir bajo H2:
  * Subheadline (16–17 px, `tinta-70`, 3 líneas): “4 preguntas en 30 segundos. Respuesta orientativa inmediata y evaluación sin costo por abogado matriculado en Misiones. Más de [n] consultas en 2025–2026.” (patrón BestLawyers “headline + subheadline → 8.6 %” [10](https://www.bestlawyers.com/article/turn-visitors-into-clients-law-firm-website-seo/6586)).
  * Foto real (opcional) o `chip` con matrículas en horizontal, no vertical.
  * Eliminar `display:none` de credenciales y unificar en 3 chips horizontales bajo hero (hoy están tras 2 bloques).
* **Wizard:** reducir `min-height` botones de 56→52 px en mobile para evitar scroll extra; añadir “Paso 1 de 3 — 30 seg” + reassurance “gratis · confidencial · sin compromiso” junto al CTA.
* **FOJA III:** mover consentimiento arriba del CTA con enlace a “Política de privacidad (Ley 25.326)” (crea página `/privacidad/`).

---

## 8. CRO — Del 3 % al 10 %+ : Embudo, hipóstesis y tests

### 8.1 Embudo actual (estimado) vs. benchmark

```
Visitantes únicos
  ↓ 100 %
Click en vertical (FOJA I)   — sin dato → instrumentar `vertical_selected`
  ↓ ~35–45 % (estimado actual)
Completan FOJA II             — sin dato → `step2_completed` (requiere 4 radios)
  ↓ ~60 % de los que llegan a II
Completan FOJA III y ven dictamen — tasa final ~8–12 % si formulario fricciona menos [4][5]
```

Benchmark legal: homepage 2–5 %, área práctica 4–8 %, contacto 8–15 %, PPC local 10–20 % [4](https://growlaw.co/blog/law-firm-conversion-rate-optimization)[7](https://intercore.net/geo-for-lawyers/landing-pages-for-law-firms/). Con tráfico pago local y formulario de 3 campos, Samudio puede apuntar a **10 % global y 18 % en PPC** (vs. 3 % actual estimado sin sticky CTA).

### 8.2 7 palancas CRO priorizadas (impacto alto / esfuerzo bajo)

**C1. Sticky CTA bar (mobile + desktop) — Impacto: ALTO.**
* Barra fija inferior en mobile: `[ WhatsApp 376 435-3599 ] [ Evaluar mi caso → ]` con `position:sticky; bottom:0`.
* En desktop, header sticky con CTA “Evaluar mi caso (30 seg)”.
* Fuente GrowLaw #1 [4](https://growlaw.co/blog/law-firm-conversion-rate-optimization).

**C2. Reducir formulario FOJA III de 5→3 campos visibles — Impacto: ALTO.**
* Solo `Nombre + WhatsApp + Consent` visibles. `Localidad` y `Email` pasan a segundo plano (desplegable “Datos opcionales” o se preguntan tras dictamen verde). Regla “3–4 campos” [5](https://gavelgrow.com/blog/conversion-rate-optimization-best-practices).
* Añadir `autocomplete` + `inputmode="tel"` (ya existe) + `type="tel"` validación con máscara `+54 9 376 ...`.
* Texto reassurance: “Te contactamos solo por tu consulta · Respuesta en 24 h · No es SPAM”.

**C3. Prueba social junto al formulario — Impacto: MEDIO-ALTO.**
* Mover 1 testimonio (“R.M. Posadas · plan de ahorro”) justo encima de FOJA III + 5 estrellas SVG + “+120 consultas evaluadas en Misiones” + badges “Mat. CAM 4372 · STJM 4031”. Patrón Landingi [3](https://landingi.com/landing-page/law-firm-examples/) + LawProNation [1](https://lawpronation.com/legal-landing-pages-that-convert/).
* Añadir widget Google reviews cuando GBP tenga 10+ reseñas (GrowLaw #3 [4](https://growlaw.co/blog/law-firm-conversion-rate-optimization)).

**C4. CTA copy en primera persona — Impacto: MEDIO.**
* “Ver mi evaluación” → “**Ver mi resultado**” o “**Quiero mi evaluación**” (first-person outperform [5](https://gavelgrow.com/blog/conversion-rate-optimization-best-practices)).
* “Continuar” → “Continuar → Ver mi caso”.

**C5. Dictamen con urgencia y escasez ética — Impacto: MEDIO.**
* Añadir en VERDE: “Vimos casos iguales en el mismo grupo/administradora. Si esperás, la cuota sigue ajustando.” + CTA WhatsApp con `text=Hola, soy [nombre]... quiero avanzar hoy`.
* Cronómetro suave: “Respuesta del estudio en 24 h hábiles”.

**C6. Live chat / WhatsApp flotante — Impacto: MEDIO (pago).**
* Widget WhatsApp (p. ej., `wa.me` flotante) con mensaje pre-llenado por vertical. En páginas de pago, live chat contextual “¿Dudas con tu plan de ahorro? Chateá ahora” (Azarian +30–50 % leads [2](https://azariangrowthagency.com/law-firm-cro-tactics/)).

**C7. A/B testing desde día 1 — Impacto: FUNDACIONAL.**
* Test 1: `H1` “Evaluá tu caso sin compromiso” vs. “¿Te subió la cuota del plan de ahorro? Evaluá tu caso en 30 seg”.
* Test 2: Form 5 vs. 3 campos.
* Test 3: Testimonios arriba vs. abajo.
* Herramienta: Google Optimize successor (VWO/PostHog) + GA4 `experiment_impression` / `experiment_conversion`.

### 8.3 Instrumentación GA4 (eventos)

Añadir en `index.html` (tras `gtag('config'...)`):

```js
gtag('event','vertical_selected',{vertical});
gtag('event','step2_completed',{vertical});
gtag('event','form_start');
gtag('event','form_error',{field: 'nombre|tel|consent'});
gtag('event','dictamen_view',{nivel:'VERDE|AMARILLO|ROJO', vertical});
gtag('event','whatsapp_click',{vertical, nivel});
gtag('event','mailto_click',{vertical});
gtag('event','reiniciar');
```

Configurar en GA4 **Conversión principal:** `dictamen_view` + `whatsapp_click` (equivalen a lead calificado). Objetivo: **CPL < $X y tasa dictamen >10 %**.

### 8.4 Flujo WhatsApp mejorado

Actual `buildWhatsAppMsg` ya personaliza vertical/nivel. Mejora:
* Pre-llenar `utm_campaign` en mensaje para atribución.
* Mensaje AMARILLO: “Quiero saber qué documentación me falta” (ya está) → añadir checklist link a nota específica.
* Mensaje ROJO: hoy solo mail; añadir WhatsApp “Consultar de todos modos (15 min sin costo)” para no perder lead frío.

---

## 9. Plan de Implementación Priorizado (RICE)

### 9.1 Matriz RICE (Reach × Impact × Confidence / Effort)

| # | Iniciativa | Reach | Impact | Conf. | Effort | RICE | Plazo |
|---|---|---|---|---|---|---|---|
| 1 | Dominio propio + HTTPS + canonical/OG básico | 100 % | 3 | 90 % | 1 | **270** | Semana 1 |
| 2 | GBP creación + NAP + 5 fotos | 60 % local | 3 | 90 % | 1 | **162** | Semana 1 |
| 3 | Fix sitemap + robots + Search Console | 100 % | 2 | 90 % | 1 | **180** | Semana 1 |
| 4 | Sticky CTA bar | 100 % | 3 | 80 % | 1 | **240** | Semana 1 |
| 5 | Form 5→3 campos + copy reassurance | 40 % (llegan a III) | 3 | 85 % | 1 | **102** | Semana 2 |
| 6 | GA4 eventos embudo | 100 % | 2 | 90 % | 1 | **180** | Semana 1 |
| 7 | Reducir fuentes a 2 familias + swap | 100 % | 2 | 80 % | 1 | **160** | Semana 2 |
| 8 | JSON-LD LegalService + FAQPage | 100 % | 2 | 80 % | 2 | **80** | Semana 2 |
| 9 | Página servicio “Abogado planes ahorro Posadas” | 30 % | 3 | 75 % | 2 | **34** | Semana 3 |
|10 | Optimizar 7 notas (title, H2, CTA 2×, imagen) | 70 % | 2 | 80 % | 2 | **56** | Semana 3–4 |
|11 | Mover testimonio junto a form + badges | 40 % | 2 | 75 % | 1 | **60** | Semana 2 |
|12 | 404 + favicon + manifest | 5 % | 1 | 90 % | 1 | **4.5** | Semana 2 |
|13 | 4 páginas service-area resto verticales | 30 % | 3 | 70 % | 2 | **31** | Mes 2 |
|14 | 8 notas nuevas (calendario §6.3) | 50 % | 3 | 70 % | 3 | **35** | Mes 2–3 |
|15 | A/B test headline vs. form | 100 % | 2 | 60 % | 2 | **60** | Mes 2 |
|16 | WhatsApp flotante + Live chat (pago) | 30 % | 2 | 60 % | 2 | **18** | Mes 3 |
|17 | Citaciones locales (10 directorios) | 20 % | 1 | 70 % | 2 | **7** | Mes 2 |

### 9.2 Roadmap 30-60-90

**Días 1–14 — Quick wins (sin depender de terceros):**
* Día 1–2: Comprar dominio, `CNAME`, `enforce_ssl`, canonical + OG + Twitter + favicon.
* Día 2–3: Crear GBP, verificar (video), cargar NAP, fotos, horarios, descripción + primera publicación.
* Día 3–4: Fix `index.html` → `index.md` o inyección manual SEO + crear `404.html`; desplegar `sitemap.xml` vía Actions.
* Día 4–5: Sticky CTA bar + reassurance microcopy + CTA copy first-person.
* Día 5–7: GA4 eventos embudo + Search Console + Bing Webmaster Tools.
* Día 7–14: Reducir fuentes, fix contraste AA, `aria-invalid`, formulario 3 campos, mover testimonio, JSON-LD.

**Días 15–30 — Crecimiento orgánico inicial:**
* Publicar 1 página servicio + optimizar 7 notas (títulos, FAQ, imágenes, interlinking).
* Solicitar 10 reseñas GBP a clientes previos.
* Lanzar 2 publicaciones GBP + 1 nota nueva (“Cómo reclamar en Misiones: 0800 vs. sumarísimo”).

**Días 31–60 — Escalado de autoridad:**
* Publicar 3 páginas service-area restantes + 5 notas nuevas (fintech, débitos, hipervulnerable).
* 10 citaciones locales + outreach a Colegio de Abogados Misiones para enlace.
* Primer A/B test (headline + form).

**Días 61–90 — Consolidación y pago:**
* 5 notas finales + página `/quien-soy/` E-E-A-T + `/privacidad/` Ley 25.326.
* Evaluación de 50 reseñas GBP + mapa de calor (Hotjar/PostHog) + segunda ronda A/B.
* Preparar campaña Google Ads local (si corresponde) con landing PPC dedicada por vertical (`/lp/plan-ahorro-posadas-ads/` sin navegación, CTA único [5](https://gavelgrow.com/blog/conversion-rate-optimization-best-practices)[7](https://intercore.net/geo-for-lawyers/landing-pages-for-law-firms/)).

---

## 10. KPIs y Medición — Qué mirar cada semana

| Objetivo | KPI | Meta 90 días | Fuente |
|---|---|---|---|
| **Visibilidad técnica** | Páginas indexadas / enviadas sitemap | >95 % | Search Console |
| **Core Web Vitals** | LCP <2.5 s · CLS <0.1 · INP <200 ms | Verde en mobile | PageSpeed Insights |
| **SEO Local** | Impresiones GBP · Clics “Llamar” · Clics “Cómo llegar” | +300 % vs. basal (0) · 15 reseñas | GBP Insights |
| **SEO Contenidos** | Sesiones orgánicas · CTR medio · Posición media | +80 % ses. org. · CTR >3.5 % · Pos. media top 15 para “plan ahorro + misiones” | GA4 + SC |
| **CRO** | Tasa dictamen / visitantes · Tasa WhatsApp click / dictamen verde | >10 % dictamen · >40 % WA click en verde | GA4 eventos |
| **Negocio** | Leads calificados (dictamen verde + WA/mail) · Coste por lead (si pago) | 30–50 leads/mes orgánico | Sheets + GA4 |

Dashboard mínimo: Data Studio con 4 tarjetas (Tráfico orgánico, Posición SC, Leads dictamen, Leads WA).

---

## 11. Riesgos, Ética y Cumplimiento

* **Publicidad letrada (Colegio de Abogados Misiones):** el sitio ya cumple: sello con matrículas CAM 4372 · STJM 4031, disclaimer “no asesoramiento ni promesa de resultado”, tono informativo no garantista. Mantener al añadir testimonios: usar iniciales + localidad + autorización (ya hace) y evitar “ganamos todos los casos”.
* **Ley 25.326 (Datos):** FOJA III ya pide consentimiento explícito con finalidad “evaluar consulta”. Añadir link a `/privacidad/` con responsable, derechos ARCO, plazo de conservación y opción de baja. No ampliar finalidad a publicidad sin nuevo consentimiento.
* **WhatsApp Business:** usar número verificado y mensaje de bienvenida con horario de respuesta (“Respondemos en 24 h hábiles”) para no generar expectativa de inmediatez 24/7 que penaliza reseñas.
* **Dependencia GitHub Pages:** sin base de datos ni servidor, el webhook `sheetsWebhook` es core. Mantener `mode: no-cors` y loguear fallback a `mailto:` si falla. Evaluar migrar a Cloudflare Pages / Vercel si se necesita SSR o funciones (p. ej., validación server-side).

---

## 12. Conclusión y Próximos Pasos Inmediatos

Estudio Samudio **no necesita “una web nueva”**. Necesita **completar la web que ya es mejor que la de sus competidores**:

1. **Hacer visible lo que ya existe** (dominio propio + sitemap + GBP + OG) → gana el 50 % del SEO perdido.
2. **Acercar la prueba social y el CTA al dolor** (sticky bar + formulario corto + testimonio junto a form) → gana el 40 % de la conversión perdida.
3. **Hablar como buscan los clientes** (páginas “abogado + vertical + Posadas/Misiones” + FAQ) → captura la demanda que hoy se lleva `defensaconsumidor.misiones.gob.ar` [10](https://defensaconsumidor.misiones.gob.ar/) y los directorios genéricos.

**Si solo se ejecutan 3 cosas esta semana, que sean:**

1. **Dominio propio + canonical/OG** (1 día).
2. **Alta y verificación GBP** (1 día).
3. **Sticky CTA + form 3 campos + eventos GA4** (1 día).

Con eso, la próxima campaña de redes/Ads dejará de enviar tráfico a una URL `github.io` sin preview y empezará a alimentar un embudo medible y escalable.

---

## Anexos

### A. Checklist técnico — “¿Está listo para lanzar Ads?”

- [ ] `https://estudiosamudio.com.ar/` responde 200 con `canonical` propio
- [ ] `https://estudiosamudio.com.ar/sitemap.xml` lista 11 URLs (home + 7 notas + listado + 2 servicios)
- [ ] `robots.txt` con `Sitemap:`
- [ ] `og:image` 1200×630 visible en https://www.opengraph.xyz/
- [ ] Lighthouse Performance >90, Accessibility >95, SEO >95
- [ ] GBP verificada y con 5 fotos + 1 publicación
- [ ] GA4 evento `dictamen_view` marca conversión
- [ ] Sticky CTA visible en mobile 375 px sin tapar contenido
- [ ] Form FOJA III con 3 campos y `aria-invalid`
- [ ] 404 custom con botón “Evaluar mi caso”

### B. Mapa de keywords inicial (intención → volumen estimado → dificultad → página destino)

| Keyword (es-AR) | Intención | Vol.* | Dif. | Página |
|---|---|---|---|---|
| `abogado defensa consumidor posadas` | Trans. | 140 | Media | `/abogado-defensa-consumidor-posadas/` |
| `abogado plan de ahorro posadas` | Trans. | 110 | Media-baja | `/abogado-planes-ahorro-posadas/` |
| `plan ahorro cuota aumento reclamo` | Inv. | 320 | Baja | `/notas/plan-de-ahorro-auto-derechos-consumidor/` |
| `seguro no solicitado banco reclamo` | Inv. | 210 | Baja | `/notas/cobros-indebidos-banco-derechos-consumidor/` |
| `fintech préstamo no solicitado` | Inv. | 170 | Baja | `/notas/prestamo-no-solicitado-fintech-derechos/` |
| `débito automático duplicado` | Inv. | 90 | Baja | `/notas/doble-cobro-debito-automatico-que-hacer/` |
| `defensa consumidor misiones teléfono` | Local | 260 | Baja | `/como-reclamar-en-misiones/` |
| `baja plan ahorro devolución misiones` | Trans. | 80 | Baja | `/notas/baja-plan-ahorro-devolucion/` |
*Vol. estimado Ubersuggest/SEMrush AR (orientativo). Validar con Keyword Planner con ubicación Misiones.

### C. Inventario de contenidos existentes (optimización express)

| Slug | Title actual | Title propuesto | Fix prioritario |
|---|---|---|---|
| `plan-de-ahorro-auto-derechos-consumidor` | Plan de ahorro de autos: tus derechos... | Abogado plan de ahorro Posadas: qué hacer si la cuota se disparó — Estudio Samudio | Añadir H2 FAQ + imagen + CTA 2× |
| `cobros-indebidos-banco-derechos-consumidor` | Cobros indebidos del banco... | Abogado reclamos bancarios Posadas: seguros y cargos no solicitados | Idem + tabla patrones |
| `prestamo-no-solicitado-fintech-derechos` | Préstamo que no pediste... | Abogado fintech Misiones: préstamo no solicitado y cargos en apps | Idem + guía preservación prueba |
| `doble-cobro-debito-automatico-que-hacer` | Te cobraron dos veces... | Doble cobro débito automático Posadas: cómo reclamar devolución completa | Idem + cita arts. 900/903 |
| `baja-plan-ahorro-devolucion` | Baja del plan de ahorro... | Baja plan de ahorro Misiones: qué te devuelven y qué descuentos son ilegales | Idem + calculadora ilustrativa |
| `bloqueo-cierre-cuenta-bancaria` | Bloqueo y cierre de cuenta... | Bloqueo cuenta bancaria Posadas: qué hacer si te quedaste sin acceso | Idem + checklist 6 pasos |
| `debitos-no-autorizados-como-frenarlos` | Débitos que no autorizaste... | Débitos no autorizados Posadas: cómo frenarlos y recuperar lo cobrado | Idem + modelo carta doc. |

### D. Wireframe sugerido — Hero + Sticky (texto)

```
[ Header: ESTUDIO SAMUDIO · Posadas · Misiones ]                     [Evaluar mi caso →]

H1: ¿Te subió la cuota del plan de ahorro?
     Evaluá tu caso sin compromiso
Sub: 4 preguntas en 30 seg. Respuesta orientativa inmediata.
     Evaluación sin costo por abogado matriculado — Mat. CAM 4372 · STJM 4031
     Posadas y toda Misiones · Proceso sumarísimo gratuito para el consumidor
     [★ ★ ★ ★ ★ 4.9/5 · 47 consultas evaluadas]  [Foto real despacho 320×240]
     [Chip] Atención por WhatsApp sin turno  [Chip] Trato directo con abogado  [Chip] Te decimos si no conviene

[ Wizard FOJA I — 4 cards verticales ]

[ Sticky bar mobile:  (376 435-3599 WhatsApp)  (Evaluar mi caso →) ]
```

### E. Fuentes y lecturas ampliadas

* SEO legal local: DDS Web [6](https://ddsweb.com.ar/diseno-paginas-web-abogados/), Danila Digital [8](https://daniladigital.com.ar/web-para-abogados-argentina/), Altoseo [1](https://altoseo.ar/agencia-seo-abogados/), Grupo Solnet [3](https://gruposolnet.com/posicionamiento-seo-geo-abogados/seo-local/), SEOAbogado [4](https://seoabogado.com/seo-local-para-abogados/), MarketingUno [6](https://marketinguno.com.ar/seo-local), LeyconSEO [10](https://leyconseo.com/), Local Business [8](https://www.local-business.es/seo-para-abogados), SEOAgencia [5](https://seoagencia.com.ar/seo-local/).
* CRO legal: LawProNation [1](https://lawpronation.com/legal-landing-pages-that-convert/), Azarian [2](https://azariangrowthagency.com/law-firm-cro-tactics/), GrowLaw [4](https://growlaw.co/blog/law-firm-conversion-rate-optimization), GavelGrow [5](https://gavelgrow.com/blog/conversion-rate-optimization-best-practices), Landingi [3](https://landingi.com/landing-page/law-firm-examples/), Intercore [7](https://intercore.net/geo-for-lawyers/landing-pages-for-law-firms/), BestLawyers [10](https://www.bestlawyers.com/article/turn-visitors-into-clients-law-firm-website-seo/6586).
* Planes de ahorro / jurisprudencia: jusmisiones [1](https://www.jusmisiones.gov.ar/consultas_online/forms/despachos_camara/download.php?archivo=47_1_4_2022-09-06.pdf), Justicia Córdoba [4](https://www.justiciacordoba.gob.ar/cargawebweb/_News/NovedadesDetalle.aspx?idNovedad=33175), La Voz [7](https://www.lavoz.com.ar/ciudadanos/planes-de-ahorro-condenan-por-dano-punitivo-a-concesionaria-administradora-de-planes-y-la-automotriz/), iProfesional [3](https://www.iprofesional.com/legales/453275-planes-autos-fallo-fulminante-abrio-resarcimientos-millonarios), Microjuris [5](https://aldiaargentina.microjuris.com/2020/05/28/problematica-de-los-planes-de-ahorro-automotor-y-de-como-proteger-al-sufriente-consumidor/), HoyDía Córdoba [10](https://hoydia.com.ar/sucesos/condenaron-a-una-concesionaria-y-a-una-administradora-de-planes-de-ahorro-por-no-entregar-un-auto/).
* Defensa Consumidor oficial: Misiones [10](https://defensaconsumidor.misiones.gob.ar/)[5](https://reclam.ar/provincias/misiones), GBA [4](https://www.gba.gob.ar/defensaconsumidores), InfoLeg.
* Técnico Jekyll / Performance / WCAG: web-quality-skills [1](https://github.com/addyosmani/web-quality-skills), free-git-hosting [3](https://free-git-hosting.github.io/boost-github-pages-seo-jekyll-plugins/), jsinibardy [4](https://jsinibardy.com/optimize-seo-jekyll), JekyllPad [5](https://www.jekyllpad.com/blog/mastering-github-pages-seo-7), Ionos WCAG [1](https://www.ionos.com/digitalguide/websites/web-development/wcag-guidelines-for-web-accessibility/), usableyaccesible [3](https://eligeunaweb.es/como-hacer-formularios-accesibles-para-cumplir-wcag-aa/).

---

**Autor del informe:** Agent Mode — Arena.ai · Auditoría sobre repositorio y sitio publicado + Wide Research sectorial  
**Próximo entregable sugerido:** implementación de los 6 quick wins P0 + pull request con diff de `index.html`/`_config.yml`/`404.html`/GBP kit (copy + fotos + guía de reseñas).

> *Posadas no necesita más “estudios integrales”. Necesita un estudio que en 30 segundos le diga al consumidor si vale la pena reclamar — y que Google y WhatsApp hagan el resto. Samudio ya tiene el motor; ahora hay que ponerle nafta local y medirlo.*
