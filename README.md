# Corporación Anderson David S.A.C. — Sitio Web

**Cliente:** Corporación Anderson David S.A.C. | RUC 20602903142  
**Contacto:** Kristel Valencia Bazán · 952656820  
**Desarrollado por:** Altive Solutions — Ag.3 Arquitectura Técnica  
**Fecha inicio:** 31/05/2026  
**Deadline staging S1:** 05/06/2026

---

## Stack técnico

- **HTML5** semántico — sin frameworks JS
- **CSS Custom Properties** — design tokens nativos
- **Google Fonts** — Barlow Condensed · Barlow Semi Condensed · Source Sans 3
- **Animaciones** — IntersectionObserver + transform/opacity únicamente
- **Formularios** — HTML nativo + Formspree (semana 2)
- **Deploy** — Vercel (static site, zero build)

---

## Estructura del proyecto

```
anderson-david/
├── index.html              ← Home (semana 1 ✅)
├── servicios.html          ← Servicios (semana 1 ✅)
├── nosotros.html           ← (semana 2 — pendiente)
├── cobertura.html          ← (semana 2 — pendiente)
├── flota.html              ← (semana 2 — pendiente)
├── contacto.html           ← (semana 2 — pendiente)
├── vercel.json             ← configuración Vercel
├── css/
│   ├── tokens.css          ← design tokens + reset + utilidades
│   ├── layout.css          ← navbar + footer
│   ├── home.css            ← estilos Home
│   └── servicios.css       ← estilos Servicios
├── js/
│   └── main.js             ← navbar scroll, hamburger, reveal, counters
└── assets/
    └── logos/
        ├── logo-horizontal.png   ← navbar/footer
        └── logo-icon.png         ← favicon
```

---

## Paleta de color

| Variable | Hex | Uso |
|---|---|---|
| `--ad-navy` | `#0A2240` | Primario / hero / navbar |
| `--ad-blue` | `#1B4F8A` | Secundario / headers |
| `--ad-sky`  | `#2A80C8` | Acento / CTAs / links |
| `--ad-ice`  | `#E8F3FB` | Fondos secciones alternas |
| `--ad-white`| `#FAFBFC` | Fondo principal |
| `--ad-ink`  | `#111827` | Texto body |
| `--ad-slate`| `#374151` | Texto secundario |
| `--ad-amber`| `#D97B2A` | Badges GPS / contraste |

---

## Setup inicial — Repo GitHub

```bash
# 1. Crear repo en GitHub (Altive org)
gh repo create altive-solutions/anderson-david --private

# 2. Clonar y copiar archivos
git clone https://github.com/altive-solutions/anderson-david
cp -r anderson-david/* anderson-david-repo/

# 3. Primer commit
cd anderson-david-repo
git add .
git commit -m "feat: semana 1 — home + servicios"
git push origin main

# 4. Crear branch staging
git checkout -b staging
git push origin staging
```

---

## Deploy Vercel

```bash
# Conectar con Vercel CLI
vercel --name anderson-david

# Variables de entorno (ninguna requerida en semana 1)
# Semana 2: agregar FORMSPREE_ENDPOINT cuando se configure el formulario

# La URL de staging quedará en:
# https://anderson-david-staging.vercel.app
```

**Configuración en Vercel dashboard:**
- Framework Preset: `Other`
- Build Command: *(vacío)*
- Output Directory: `.`
- Install Command: *(vacío)*
- Branch de staging: `staging`
- Branch de producción: `main`

---

## Pendientes técnicos

### Inmediatos (antes de staging S1)
- [ ] Subir fotos reales de flota desde Drive `/Altive/Clientes/Anderson David/Activos/`
- [ ] Reemplazar URL de Unsplash en `css/home.css` (`.hero__bg-image`) con foto real
- [ ] Confirmar con Kristel: años de experiencia (actualmente: 15+)
- [ ] Confirmar: ¿"ventas" es página separada o CTA en contacto?

### Semana 2
- [ ] `nosotros.html` — historia, equipo, valores
- [ ] `cobertura.html` — mapa interactivo o SVG rutas
- [ ] `flota.html` — galería fotos reales (20 imágenes Drive)
- [ ] `contacto.html` — formulario Formspree + datos
- [ ] Formulario Formspree: configurar endpoint, validación HTML5
- [ ] OG image personalizada
- [ ] `sitemap.xml` y `robots.txt`
- [ ] Google Analytics / Search Console

---

## Instrucciones de reemplazo de imágenes

### Hero (Home)
1. Descargar la foto de mayor resolución de Drive `/Activos/` (278KB–353KB aprox.)
2. En `css/home.css`, línea ~35:
```css
background-image: url('https://images.unsplash.com/photo-...');
/* reemplazar con: */
background-image: url('assets/flota/hero.jpg');
```
3. Subir la foto a `assets/flota/hero.jpg`

### Favicon personalizado
El `logo-icon.png` ya está configurado. Para mejorar:
```bash
# Generar favicon.ico desde logo-icon.png
convert assets/logos/logo-icon.png -resize 32x32 favicon.ico
```

---

## Notas de implementación

**Logo en navbar:** Se usa un pill blanco semitransparente detrás del logo horizontal.
Es la solución más rápida y visualmente limpia sin necesitar versión SVG del logo.

**Años de experiencia:** Placeholder "15+" activo. Confirmar con Kristel antes de launch.

**Fotos:** Se usa imagen Unsplash como placeholder en hero. Reemplazar antes de presentar
al cliente (el brief indica "sin stock photos").

**Formspree:** Integración prevista para semana 2. Endpoint a crear en
cuenta Altive: `https://formspree.io/f/[ID]`
