# Sistema visual — Estudio Samudio

Fuente única de verdad de los tokens. Están declarados en `_layouts/default.html`
(bloque `:root`) y replicados a mano en `index.html`. **Si cambiás uno, cambialo en los dos.**

## Color

| Token | Hex | Uso |
|---|---|---|
| `--papel` | `#FAF7F1` | fondo de la hoja |
| `--papel2` | `#F2EDE3` | cajas (CTA, destacados) |
| `--nieve` | `#FEFCF8` | superficies elevadas |
| `--tierra` | `#A8452A` | acento principal, eyebrows |
| `--tierra-claro` | `#B44C2F` | gradiente superior de botones |
| `--tierra-oscuro` | `#8A3520` | enlaces en cuerpo de texto |
| `--tierra-suave` | `#F6E8E1` | fondos de acento |
| `--tinta` | `#12233B` | texto principal, footer |
| `--tinta-70` | `#5A6474` | bajadas, texto secundario |
| `--tinta-45` | `#8C93A0` | metadatos, disclaimers |
| `--linea` | `#E3DCCF` | separadores |
| `--linea-fuerte` | `#D2C8B6` | subrayado de enlaces |

Fondo exterior: `#EFE9DE` con `radial-gradient(1200px 600px at 50% -10%, #F7F1E6, #EFE9DE 60%)`.

## Tipografía

| Rol | Familia | Uso |
|---|---|---|
| `--serif` | Archivo 400–800 | H1, H2, títulos de nota (pese al nombre del token, es sans display) |
| `--sans` | Inter 400–600 | cuerpo, 17.5px / 1.62 |
| `--mono` | IBM Plex Mono 400/600 | eyebrows, matrículas, disclaimers, navegación |

Los eyebrows van en mono, uppercase, `letter-spacing` 2.2–3.5px, color `--tierra`.

## Layout

- Ancho de lectura: `.hoja` máx. **760px**; párrafos y bajadas limitados a `52ch`.
- Padding lateral: 32px móvil / 64px desde 700px.
- La sombra de `.hoja` se desactiva por debajo de 760px.

## Reglas

1. **Coherencia con las placas.** Las piezas de redes usan la misma paleta que el sitio.
   Placa en una gama y aterrizaje en otra rompe la continuidad de marca.
2. **El acento es uno solo.** `--tierra` para acción y jerarquía; nunca introducir un
   segundo color de acento.
3. **Sello institucional obligatorio** en todas las piezas: nombre, matrículas
   (CAM 4372 · STJM 4031) y alcance territorial.
4. **Disclaimer obligatorio** al pie de toda nota: información general, no asesoramiento
   sobre caso concreto ni promesa de resultado.
