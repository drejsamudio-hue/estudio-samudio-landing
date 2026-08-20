# Diagnóstico GA4 — Eventos No Se Registran

## Problema
Los eventos `dictamen_view` y `whatsapp_click` se disparan en JavaScript pero no aparecen en Google Analytics 4.

## Checklist de Diagnóstico

### 1️⃣ Verificar si GA4 recibe CUALQUIER evento
- [ ] Abre: https://analytics.google.com/analytics/web/#/a403262123p548273838/admin
- [ ] Ve a: **Admin** → **Real-time** (o **Tiempo real**)
- [ ] Abre la landing en otra pestaña: https://drejsamudio-hue.github.io/estudio-samudio-landing/
- [ ] Espera 5 segundos y mira el panel de tiempo real
- [ ] **¿Ves eventos appearing en el panel de tiempo real?**

#### Si ves eventos en tiempo real:
✅ GA4 está recibiendo datos → problema específico de `dictamen_view`/`whatsapp_click`

#### Si NO ves eventos en tiempo real:
❌ GA4 no recibe datos → problema global de configuración

---

### 2️⃣ Verificar el Measurement ID correcto
- [ ] En GA4 Admin → **Data Streams**
- [ ] Haz clic en tu web stream (debe estar llamado algo como "Estudio Samudio" o tu dominio)
- [ ] Busca **Measurement ID** (empieza con `G-`)
- [ ] **¿Es `G-LTD1RWM91T`?**

Si es diferente, hay que actualizar el HTML.

---

### 3️⃣ Verificar si el evento `page_view` aparece
- [ ] En GA4 Admin → **Events** (o **Eventos**)
- [ ] Busca `page_view` en la lista
- [ ] **¿Aparece en la tabla?**

Si `page_view` aparece = GA4 recibe datos, problema específico de `dictamen_view`
Si `page_view` NO aparece = GA4 no recibe datos, problema de configuración global

---

### 4️⃣ Verificar la consola del navegador (Browser Console)
- [ ] En Chrome, abre la landing
- [ ] Presiona **F12** (abre Developer Tools)
- [ ] Ve a la pestaña **Console**
- [ ] Completa el wizard
- [ ] **¿Ves mensajes `[GA4] Evento disparado:` en la consola?**

Si sí = eventos se disparan, problema es que GA4 no los recibe
Si no = eventos no se disparan, hay error en JavaScript

---

## Próximos Pasos Según Resultado

**Si recibe eventos globalmente pero no `dictamen_view`:**
→ Revisar si la función `gv()` se llama en el momento correcto

**Si no recibe eventos globalmente:**
→ Verificar Measurement ID en el HTML vs. GA4 Admin
→ Verificar si hay bloqueador de anuncios/scripts habilitado

---

Reportá aquí qué encontrás:
