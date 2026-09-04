# Ponchumoy 3D - versión iPad

Versión adaptada del HTML original para jugar desde Safari o como app web en iPad.

## Mejoras incluidas

- Controles táctiles grandes para girar, acelerar y frenar.
- Diseño optimizado para iPad en horizontal, con safe areas.
- Instalación como app desde Safari.
- Manifest, iconos y service worker.
- Caché offline tras la primera carga con conexión.
- Ajustes de rendimiento WebGL para iPad.
- Sonido compatible con la política de reproducción de iPadOS.
- Corrección de textos dañados por codificación.
- Carrera rápida funcional y acceso al menú de campeonatos.
- HUD de carrera con velocidad y progreso.
- Correcciones menores de lógica y del logro de campeonatos.

## Publicar en GitHub Pages

Sube el contenido de esta carpeta a la raíz del repositorio `ponchumoy-3d`.

En GitHub abre **Settings > Pages** y selecciona:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

La URL esperada será:

`https://rubenvegantt.github.io/ponchumoy-3d/`

## Instalar en iPad

1. Abre la URL con Safari.
2. Pulsa Compartir.
3. Elige **Añadir a pantalla de inicio**.
4. Mantén activada la opción de abrir como app web, si aparece.
5. Juega con el iPad en horizontal.

## Nota de conexión

Three.js se carga de `unpkg.com` en la primera ejecución. El service worker intenta guardarlo para permitir posteriores ejecuciones sin conexión. La primera apertura debe hacerse con Internet.
