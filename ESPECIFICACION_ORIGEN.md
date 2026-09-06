# Ponchumoy Arcade 3D — Especificación de la versión final

Este documento reúne las funcionalidades, decisiones técnicas y requisitos aplicados al proyecto **Ponchumoy Arcade 3D**. Está pensado para incorporar estas capacidades a otra versión existente del juego.

---

## 1. Objetivo del producto

Crear un juego de carreras 3D arcade, jugable en navegador y compatible con ordenador, tablet y especialmente iPad. El juego debe priorizar velocidad, diversión inmediata, derrapes exagerados, vehículos premium y circuitos cerrados inspirados en competiciones reales.

### Principios principales

- Estilo **muy arcade**, no simulador.
- Funcionamiento directo desde navegador.
- Prioridad a iPad y controles táctiles.
- Sin anuncios, sin compras integradas y sin conexión obligatoria para jugar.
- Progresión mediante campeonatos, desbloqueos, garaje y récords.
- Multijugador local para dos jugadores en pantalla dividida.
- Vehículos con valoración fija que el jugador no puede modificar.

---

## 2. Nombre del juego

**Ponchumoy Ponchumaniano**

Nombre corto para el HUD y archivos:

**Ponchumoy Arcade 3D**

---

## 3. Compatibilidad y despliegue

### Requisito crítico

La versión final debe funcionar al abrir el archivo HTML directamente, sin quedarse bloqueada en una pantalla de carga y sin requerir servidor local.

### Implementación recomendada

Usar Three.js en formato clásico, no como módulo ES:

```html
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
```

No utilizar esta estructura si se pretende abrir el HTML directamente desde archivos locales:

```js
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
```

Los módulos ES pueden requerir un servidor HTTP según el navegador y su configuración de seguridad.

### Requisitos de navegador

- Safari para iPadOS.
- Chrome, Edge, Firefox y Safari en escritorio.
- WebGL activado.
- Manejo de errores si Three.js no puede cargarse: mostrar un mensaje claro indicando que se necesita conexión para descargar la librería CDN o usar una copia local de Three.js.

### Alternativa 100% offline

Para que no dependa de Internet ni siquiera en la primera apertura:

1. Descargar `three.min.js`.
2. Guardarlo junto al HTML, por ejemplo en `libs/three.min.js`.
3. Reemplazar la URL CDN por:

```html
<script src="libs/three.min.js"></script>
```

---

## 4. Motor gráfico 3D

### Base técnica

- Motor: Three.js / WebGL.
- Renderizador: `THREE.WebGLRenderer`.
- Antialias: activado.
- `powerPreference: 'high-performance'`.
- Resolución de píxel limitada a 2 para evitar sobrecarga en Retina/iPad.

```js
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance'
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
```

### Estética visual

- Diseño neón/cyber-arcade.
- Asfalto oscuro.
- Barreras luminosas en cyan, magenta o rojo.
- Faros y pilotos traseros emisivos.
- Niebla moderada para ocultar el final del trazado y mejorar rendimiento.
- Iluminación hemisférica más luz direccional principal.
- Iluminación ambiental de colores azul/cyan para reforzar el estilo arcade.

---

## 5. Conducción arcade

La física no debe perseguir realismo estricto. Debe sentirse rápida, sencilla y espectacular.

### Reglas de manejo

- Aceleración inmediata y fuerte.
- Velocidad alta incluso con pocos segundos de aceleración.
- Frenada intensa y respuesta rápida.
- Dirección muy sensible.
- Drift cuando el jugador gira a velocidad media o alta.
- Límite de pista con corrección o rebote suave, no accidente definitivo.
- Cámara trasera dinámica que siga al vehículo con suavizado.

### Parámetros orientativos

```js
const ARCADE = {
  acceleration: 4.2,
  brakeForce: 6.5,
  maxForwardSpeed: 2.4,
  maxReverseSpeed: 0.35,
  steeringResponse: 9,
  steeringForce: 10,
  driftMultiplier: 0.75,
  cameraFollow: 6
};
```

### Ejemplo de actualización

```js
const targetSpeed = gasPressed
  ? ARCADE.maxForwardSpeed
  : brakePressed
    ? -ARCADE.maxReverseSpeed
    : 0;

speed += (targetSpeed - speed) * ARCADE.acceleration * delta;
steer += (targetSteer - steer) * Math.min(1, delta * ARCADE.steeringResponse);

const drift = Math.abs(steer) * Math.max(0, speed) * ARCADE.driftMultiplier;
carX += steer * (ARCADE.steeringForce + speed * 8) * delta;
carZ += speed * 58 * delta;
```

### Efectos arcade

- Mostrar palabras grandes en pantalla: `BOOST!`, `TURBO!`, `SPEED!`, `NITRO!`.
- Activarlas al superar un umbral de velocidad.
- Partículas de humo o neón durante el drift.
- Contador de drift en HUD.
- Ruedas girando a gran velocidad.
- Inclinación lateral del coche al girar.

---

## 6. Vehículos: marcas y catálogo

### Requisito legal

No incluir modelos, logotipos, nombres de pilotos, diseños oficiales ni marcas reales en una publicación comercial sin licencias de los titulares. Para un prototipo privado se pueden usar como referencias de catálogo; para distribuir el juego, usar nombres y diseños ficticios o adquirir licencias.

### Marcas de coches solicitadas

1. Lamborghini
2. Ferrari
3. Bentley
4. Maybach
5. Rolls-Royce
6. Aston Martin
7. Porsche
8. Bugatti
9. Mercedes
10. BMW
11. Audi
12. Pagani
13. McLaren
14. Koenigsegg

### Familias de coches recomendadas

Cada entrada de vehículo debe contener:

```json
{
  "id": "car_hyper_001",
  "brand": "Marca",
  "model": "Modelo",
  "year": 2025,
  "type": "car",
  "category": "hypercar",
  "vg": 89,
  "acceleration": 96,
  "grip": 93,
  "topSpeed": 420,
  "weight": 1420,
  "drive": "awd",
  "modelFile": "assets/vehicles/model.glb",
  "locked": false
}
```

### Categorías de coche

- Clásico
- Gran turismo
- Deportivo
- Superdeportivo
- Hypercar
- SUV premium
- Berlina de lujo
- Prototipo de competición
- GT3
- Monoplaza
- Resistencia
- Drift

### Valoración global fija

La propiedad `vg` es fija y no se puede modificar con mejoras del jugador.

Ejemplo de rangos:

| VG | Uso |
|---:|---|
| 50–64 | Clásicos y vehículos de iniciación |
| 65–74 | Deportivos, GT y vehículos intermedios |
| 75–84 | Superdeportivos y motos deportivas |
| 85–94 | Hypercars, GT3, prototipos y vehículos élite |
| 95–100 | Vehículos especiales o extremos |

---

## 7. Motos: marcas y catálogo

### Marcas solicitadas

1. Triumph
2. Honda
3. Ducati
4. BMW Motorrad
5. Suzuki
6. Yamaha
7. Vespa
8. Aprilia

### Tipos de moto

- Superbike
- MotoGP / prototipo
- Naked deportiva
- Sport touring
- Adventure
- Enduro
- Supermoto
- Scooter
- Clásica / café racer
- Cruiser

### Datos de moto

```json
{
  "id": "bike_sport_001",
  "brand": "Marca",
  "model": "Modelo",
  "year": 2024,
  "type": "bike",
  "category": "superbike",
  "vg": 82,
  "acceleration": 90,
  "grip": 84,
  "topSpeed": 305,
  "weight": 205,
  "drive": "chain",
  "modelFile": "assets/bikes/model.glb"
}
```

### Diferencias de manejo de motos

- Modelo más estrecho.
- Mayor aceleración inicial.
- Menor margen de colisión.
- Inclinación visual más marcada en curvas.
- Drift menos frecuente; usar deslizamiento controlado en frenadas.

---

## 8. Modelos 3D reales

### Estado recomendado

El prototipo actual puede usar modelos generados con primitivas de Three.js. Para una versión visualmente realista, sustituirlos por modelos GLB/GLTF propios o con licencia.

### Estructura de carpetas

```text
ponchumoy/
├── index.html
├── data/
│   ├── vehicles.json
│   ├── bikes.json
│   ├── tracks.json
│   └── championships.json
├── assets/
│   ├── vehicles/
│   │   ├── hypercar_01.glb
│   │   └── gt_01.glb
│   ├── bikes/
│   │   └── superbike_01.glb
│   ├── tracks/
│   │   ├── monza.glb
│   │   └── mugello.glb
│   ├── textures/
│   └── sounds/
└── libs/
    └── three.min.js
```

### Carga de GLB

Si se usan GLB/GLTF, será necesario `GLTFLoader`. Para evitar problemas de módulos, usar un entorno con servidor HTTP o compilar con Vite/Webpack. Si el objetivo es abrir el HTML directamente, mantener una versión de fallback con geometrías propias y cargar GLB solo cuando estén disponibles.

### Convención de nombres de nodos

En cada modelo GLB:

```text
body
wheel_front_left
wheel_front_right
wheel_rear_left
wheel_rear_right
steering
headlight_left
headlight_right
taillight_left
taillight_right
exhaust
```

### Animaciones necesarias

- Girar ruedas según velocidad.
- Girar ruedas delanteras según dirección.
- Inclinar carrocería en curvas.
- Suspensión vertical sutil al acelerar/frenar.
- Emisión de partículas desde escape o neumáticos.

---

## 9. Circuitos cerrados

No usar terreno infinito como modo principal. El juego debe centrarse en circuitos cerrados de carreras.

### Circuitos de referencia F1

- Mónaco
- Monza
- Spa-Francorchamps
- Silverstone
- Suzuka
- Circuit de Barcelona-Catalunya
- Red Bull Ring
- Hungaroring
- Interlagos
- Yas Marina

### Circuitos de referencia MotoGP

- Mugello
- Jerez
- Catalunya
- Assen
- Phillip Island
- Sachsenring
- Misano
- MotorLand Aragón
- Sepang
- Mandalika

### Requisito legal

Las reproducciones exactas, nombres oficiales, marcas, señalética y trazados comerciales de F1/MotoGP pueden requerir licencia. En distribución pública, usar circuitos ficticios inspirados en sus características:

- “Puerto Principado” en vez de Mónaco.
- “Templo de la Velocidad” en vez de Monza.
- “Bosque de las Ardenas” en vez de Spa.
- “Colinas Toscana” en vez de Mugello.

### Componentes de pista

- Asfalto con PBR: `roughness` alta, `metalness` baja.
- Pianos rojos/blancos, o neón para el modo arcade.
- Barreras laterales.
- Gradas, boxes, pantallas gigantes y banderas ficticias.
- Línea de salida/meta.
- Checkpoints y sistema de vueltas.
- Trazado cerrado: el último checkpoint conecta con el primero.

---

## 10. Clima y hora

### Estados de clima

- Soleado: agarre 1.00.
- Nublado: agarre 0.95.
- Lluvia: agarre 0.75–0.82.
- Tormenta: agarre 0.65.
- Nieve: agarre 0.60–0.70.
- Noche: agarre 0.95, luces de circuito activadas.

### Efectos

- Partículas de lluvia con `THREE.Points`.
- Partículas de nieve con velocidad de caída lenta.
- Niebla ajustada por clima.
- Reflejos simulados o mapas de entorno en asfalto mojado.
- Iluminación reducida y faros reforzados en la noche.

---

## 11. Multijugador local

### Objetivo

Dos jugadores en el mismo dispositivo, con pantalla dividida verticalmente: P1 a la izquierda y P2 a la derecha.

### Renderizado

Usar `setScissorTest`, `setViewport` y `setScissor`.

```js
renderer.setScissorTest(true);

// Jugador 1: mitad izquierda
renderer.setScissor(0, 0, width / 2, height);
renderer.setViewport(0, 0, width / 2, height);
renderer.render(scene, cameraP1);

// Jugador 2: mitad derecha
renderer.setScissor(width / 2, 0, width / 2, height);
renderer.setViewport(width / 2, 0, width / 2, height);
renderer.render(scene, cameraP2);

renderer.setScissorTest(false);
```

### Requisitos de interfaz

- Línea divisoria central visible.
- HUD individual por cada jugador.
- Color P1: cyan.
- Color P2: rojo o magenta.
- Velocidad, vuelta, posición, distancia y drift independientes.

### Controles en iPad

- Para P1: volante y pedales ubicados en su mitad de pantalla.
- Para P2: volante y pedales ubicados en su mitad de pantalla.
- Debe usarse `pointerdown`, `pointerup`, `pointercancel` y `pointerleave` para evitar problemas táctiles.
- Evitar `touchmove` global que bloquee la interacción de controles.

---

## 12. Modo un jugador e IA

### IA de rivales

- Rivales siguiendo una lista de waypoints de la pista.
- Velocidad base según valoración VG y dificultad.
- Variación ligera de trazada para evitar convoyes.
- Capacidad de recuperación si se salen de pista.

### Sistema de dificultad

| Dificultad | Ritmo IA | Errores | Ayudas jugador |
|---|---:|---:|---|
| Fácil | 70% | Frecuentes | Altas |
| Media | 85% | Ocasionales | Medias |
| Difícil | 100% | Pocos | Bajas |
| Élite | 110% | Muy pocos | Desactivadas |

---

## 13. Campeonatos

### Estructura de una copa

```json
{
  "id": "cup_rookie",
  "name": "Copa Rookie",
  "difficulty": "easy",
  "minVG": 50,
  "maxVG": 75,
  "races": ["track_001", "track_002", "track_003"],
  "points": [25, 18, 15, 12, 10, 8, 6, 4, 2, 1],
  "unlockReward": "brand_or_vehicle_id"
}
```

### Copas sugeridas

- Copa Rookie: 3 carreras, VG 50–75.
- Copa Pro: 5 carreras, VG 70–88.
- Copa Élite: 7 carreras, VG 85–94.
- Copa Leyendas: 10 carreras, VG 90–100.
- Copa GT.
- Copa Hypercar.
- Copa Superbikes.
- Copa MotoGP.
- Copa lluvia.
- Copa nocturna.

### Puntuación

```js
const pointsByPosition = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
```

### Progresión

- Guardar carrera actual del campeonato.
- Guardar puntos de jugador y rivales.
- Guardar posiciones y resultados de cada prueba.
- Desbloquear recompensas solo al completar o ganar la copa.

---

## 14. Garaje 3D

### Funciones

- Ver vehículos desbloqueados.
- Filtrar por marca, tipo, categoría, década y VG.
- Rotar cámara con gesto táctil o ratón.
- Zoom con pellizco o rueda.
- Mostrar ficha técnica.
- Seleccionar vehículo para carrera o campeonato.

### Datos visibles

- Marca y modelo.
- Año.
- Categoría.
- Potencia.
- Peso.
- Tracción.
- Velocidad máxima.
- Aceleración.
- Agarre.
- Frenada.
- Valoración Global fija (VG).

### Cámara de garaje

- Cámara orbitando lentamente si no hay interacción.
- Al arrastrar, el usuario rota la vista.
- Iluminación de estudio con luces superiores, laterales y reflejos.

---

## 15. Sonido

### Sonidos mínimos

- Motor en ralentí.
- Motor acelerando por velocidad/RPM.
- Frenada.
- Derrape.
- Choque contra barrera.
- Cambio de marcha opcional.
- UI: selección, inicio, cuenta atrás, final.
- Ambiente: público, boxes, viento, lluvia, nocturno.

### Implementación inicial

Para prototipo se puede usar `AudioContext` y osciladores. Para producto final, usar muestras de audio con licencia en archivos `.mp3`, `.ogg` o `.wav`.

### Motor dinámico

```js
const frequency = minRPM + (maxRPM - minRPM) * speedNormalized;
oscillator.frequency.setTargetAtTime(
  frequency,
  audioContext.currentTime,
  0.03
);
```

### Audio espacial

Para una versión avanzada:

- Usar `THREE.PositionalAudio`.
- Sonidos de rivales atenuados por distancia.
- Motor propio centrado y más alto.

---

## 16. Guardado de progreso

### Uso de localStorage

Clave sugerida:

```js
const SAVE_KEY = 'ponchumoy_arcade_save_v1';
```

### Datos que se deben guardar

```json
{
  "version": 1,
  "settings": {
    "sound": true,
    "quality": "high",
    "selectedVehicle": "car_001"
  },
  "profile": {
    "totalRaces": 0,
    "wins": 0,
    "podiums": 0,
    "points": 0,
    "bestLap": {}
  },
  "unlocks": {
    "vehicles": [],
    "drivers": [],
    "tracks": [],
    "cosmetics": []
  },
  "championships": {},
  "records": {},
  "achievements": []
}
```

### Buenas prácticas

- Guardar al finalizar una carrera.
- Guardar después de desbloquear contenido.
- Incluir versión para migrar datos en actualizaciones.
- Añadir botones de exportar/importar partida en JSON.
- Añadir botón de reset con confirmación explícita.

---

## 17. Rendimiento en iPad

### Objetivos

- 60 FPS cuando sea posible.
- Reducir automáticamente detalles si bajan los FPS.
- Evitar cargar todos los modelos 3D a la vez.
- Usar instanciación para gradas, árboles, barreras y público.

### Ajustes de calidad

| Calidad | Pixel ratio | Sombras | Partículas | Postprocesado |
|---|---:|---:|---:|---|
| Baja | 1.0 | 512 | Bajo | No |
| Media | 1.25 | 1024 | Medio | Bloom ligero |
| Alta | 1.5 | 2048 | Alto | Bloom |
| Ultra | Máx. 2.0 | 2048/4096 | Alto | Bloom + efectos |

### Recomendaciones iPad

- Limitar `renderer.setPixelRatio` a 2.
- Usar una sola luz direccional con sombras.
- Usar máximo 2–4 luces dinámicas cercanas por escena.
- Limitar partículas activas a 100–300.
- No usar geometrías nuevas cada frame: reutilizar pools de partículas.
- En pantalla dividida, bajar automáticamente calidad a media/alta.

---

## 18. Controles

### Teclado

| Acción | Teclas |
|---|---|
| Acelerar | W, Flecha arriba, Espacio |
| Frenar/reversa | S, Flecha abajo |
| Girar izquierda | A, Flecha izquierda |
| Girar derecha | D, Flecha derecha |
| Pausa | Escape o P |

### Táctil

- Botón grande para gas.
- Botón grande para freno.
- Volante táctil o botones izquierda/derecha.
- Usar Pointer Events para compatibilidad:

```js
button.addEventListener('pointerdown', startAction);
button.addEventListener('pointerup', stopAction);
button.addEventListener('pointercancel', stopAction);
button.addEventListener('pointerleave', stopAction);
```

---

## 19. Pantalla de carga y fallbacks

### Regla fundamental

No mantener una capa de carga de forma indefinida.

### Comportamiento correcto

1. Mostrar “Cargando…” al comenzar.
2. Inicializar renderer, escena y UI.
3. Iniciar el primer render frame.
4. Ocultar la capa de carga aunque se use un modelo de fallback.
5. Si Three.js o WebGL falla, mostrar mensaje visible con instrucciones.

### Comprobación WebGL

```js
try {
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) throw new Error('WebGL no disponible');
} catch (error) {
  showError('Este navegador o dispositivo no admite WebGL.');
}
```

---

## 20. Errores detectados y correcciones

### Problema: “Cargando arcade mode” no desaparece

**Causa probable:** el código se detiene antes de ejecutar el render o antes de ocultar el loader, normalmente por fallo de importación de módulos ES o error JavaScript.

**Corrección aplicada:**

- Usar Three.js como script clásico desde CDN o copia local.
- Evitar `import` en HTML que se abre mediante `file://`.
- Mostrar un fallback si `window.THREE` no existe.
- Separar inicialización de la lógica de juego.
- Iniciar siempre `requestAnimationFrame` después de crear la escena.

### Problema: “3D hiperrealista” con cajas simples

**Corrección recomendada:**

- El prototipo puede usar primitivas; no llamarlo modelo real de vehículo.
- Para realismo, importar modelos GLB propios o con licencia.
- Añadir texturas PBR, mapas HDRI, normal maps, roughness maps, reflejos y detalles de entorno.

### Problema: catálogo enorme afecta al rendimiento

**Corrección recomendada:**

- Cargar solo los datos de catálogo al inicio.
- Cargar el GLB del vehículo seleccionado bajo demanda.
- Guardar modelos usados recientemente en caché.
- Descargar modelos de alta calidad solo en calidad Ultra o Wi-Fi.

---

## 21. Lista de verificación previa al despliegue

### Funcionamiento

- [ ] El HTML se abre en Safari iPad sin quedar bloqueado.
- [ ] El botón de empezar inicia una carrera.
- [ ] Acelerar, frenar y girar funcionan con controles táctiles.
- [ ] Las teclas funcionan en ordenador.
- [ ] La pausa funciona.
- [ ] El juego responde al cambio de orientación y tamaño de ventana.

### 3D y rendimiento

- [ ] WebGL se comprueba antes de iniciar.
- [ ] Hay fallback para modelos que no cargan.
- [ ] La calidad gráfica se adapta a iPad.
- [ ] No se crean cientos de objetos por frame.
- [ ] La pantalla dividida reduce el detalle cuando sea necesario.

### Juego

- [ ] Los circuitos son cerrados y tienen vuelta/meta.
- [ ] La IA sigue checkpoints.
- [ ] Los coches y motos tienen VG fija.
- [ ] Los campeonatos asignan puntos correctamente.
- [ ] Los desbloqueos se aplican una sola vez.
- [ ] Los récords se guardan.
- [ ] Los logros se actualizan.

### Audio

- [ ] El navegador activa audio tras una interacción del usuario.
- [ ] Sonido de motor cambia con la velocidad.
- [ ] Se puede silenciar desde ajustes.
- [ ] No hay múltiples loops de motor activos después de reiniciar.

### Legal y distribución

- [ ] Revisar licencias de modelos 3D, texturas, música y sonidos.
- [ ] No usar marcas, modelos, pilotos, logos o circuitos oficiales sin licencia en una versión publicada.
- [ ] Incluir atribución cuando una licencia CC-BY lo requiera.
- [ ] Usar nombres, diseños y circuitos ficticios si no hay licencias oficiales.

---

## 22. Próximo orden de implementación

1. Corregir la base HTML/Three.js y verificar el inicio sin pantalla de carga bloqueada.
2. Implementar un circuito cerrado con checkpoints y vueltas reales.
3. Integrar conducción arcade y controles táctiles.
4. Añadir vehículos de fallback generados por geometría.
5. Implementar vehículos y motos como datos JSON.
6. Cargar modelos GLB bajo demanda.
7. Añadir IA con waypoints.
8. Añadir multijugador local con pantalla dividida.
9. Implementar garaje 3D y selección de vehículo.
10. Implementar campeonatos, puntos, desbloqueos y guardado.
11. Añadir clima, partículas y audio.
12. Optimizar para iPad y probar en dispositivos reales.
13. Revisar licencias y empaquetar una versión de producción.

---

## 23. Resultado esperado

La versión final debe ser un juego de carreras **3D arcade**, rápido y visualmente atractivo, con circuitos cerrados, coches y motos seleccionables, modo un jugador y multijugador local, campeonatos, garaje, progresión, sonidos, clima y controles táctiles adaptados a iPad.
