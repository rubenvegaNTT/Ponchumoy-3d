# Ponchumoy Ponchumaniano — Arcade 3D V3.1 Equilibrada

Tercera versión independiente basada en la versión 3D Arcade anterior y ampliada con la especificación funcional suministrada.

## Ajuste V3.1 de jugabilidad

- Velocidad de carrera reducida aproximadamente a la mitad respecto a V3.
- Aceleración rebalanceada para que haya tiempo real de leer la pista y esquivar.
- IA recalibrada respecto al ritmo del vehículo del jugador para evitar victorias por diferencia absurda de velocidad.
- Menos obstáculos y distribución algo más limpia.
- Impactar con un obstáculo elimina alrededor del 85% de la velocidad, cancela el turbo y deja un breve periodo de recuperación.
- Turbo conservado, pero limitado a un 25% extra de velocidad para que siga siendo útil sin volver el juego incontrolable.


## Incluye

- Conducción arcade rápida, drift, frenada fuerte y cámara chase dinámica.
- Turbo recogible con aumento temporal de velocidad y efectos visuales/sonoros.
- Circuitos cerrados ficticios inspirados en tipos de trazado reales.
- Vueltas, clasificación, IA y cuatro niveles de dificultad.
- Coches y motos ficticios con VG fija y manejo diferenciado.
- Garaje 3D con filtros, ficha técnica, rotación y zoom táctil.
- Campeonatos, puntos, recompensas, desbloqueos, récords y logros.
- Clima: soleado, nublado, lluvia, tormenta, nieve y noche.
- Partículas de lluvia/nieve y sonido dinámico mediante Web Audio.
- Multijugador local para 2 jugadores con pantalla dividida y controles táctiles independientes.
- Guardado en localStorage con exportación/importación JSON.
- Calidad gráfica adaptativa y ajustes específicos para iPad.
- PWA para GitHub Pages, instalable desde Safari.

## Despliegue

Copia el contenido de esta carpeta a la raíz de un repositorio público y activa GitHub Pages desde `main` y `/ (root)`.

## Nota técnica

Three.js se carga como script clásico desde jsDelivr, tal como pide la especificación para evitar módulos ES. La PWA intenta guardarlo en caché tras la primera carga. Por tanto, la primera apertura desde GitHub Pages requiere conexión. El resto del juego no carga modelos o assets externos.

## Nota legal

El catálogo, los nombres de vehículos y los circuitos son ficticios. No se incluyen logos, pilotos, diseños oficiales ni marcas reales.
