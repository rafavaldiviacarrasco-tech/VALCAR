# Intervalo · Temporizador de entrenos (PWA)

Funciona 100 % offline una vez cargada la primera vez. Sin dependencias ni build.

## Probar en local
    cd intervalo-pwa
    python3 -m http.server 8000      # y abre http://localhost:8000

## Instalar en el móvil (necesita HTTPS)
Sube la carpeta a cualquier hosting estático con HTTPS (GitHub Pages, Netlify, Cloudflare Pages, Vercel…),
abre la URL en el móvil y:
- **Android (Chrome):** botón «Instalar» de la app o menú ⋮ → «Instalar aplicación».
- **iPhone (Safari):** Compartir → «Añadir a pantalla de inicio».

## Notas
- Los entrenos se guardan en `localStorage` del navegador/app instalada.
- El sonido se activa al primer toque (requisito de iOS/Android). El botón del altavoz silencia.
- La pantalla se mantiene encendida durante el entreno (Screen Wake Lock, si el navegador lo soporta).
- Si cambias archivos, sube la constante `VERSION` en `sw.js` para forzar la actualización de la caché.

## Compartir entrenos
Menú ⋮ de un entreno → «Compartir enlace» (compartir nativo, WhatsApp o copiar). El entreno viaja dentro del propio enlace
(`…/index.html#w=…`), sin servidor ni cuentas: quien lo abre ve el entreno y elige «Iniciar ahora» o «Guardar en mis entrenos».
Para que otros puedan abrirlo, la app debe estar alojada con HTTPS.

## Sesiones de gimnasio e historial
- «+» → «Sesión de gimnasio»: ejercicios con series, repeticiones, con/sin peso, peso objetivo y descanso.
- Durante la sesión se anota peso y repeticiones de cada serie; el historial guarda todo (récords, notas, volumen).
- Historial → Exportar: copia completa `.json` (entrenos + historial), tabla `.csv` (una fila por serie) y resumen `.md`. «Restaurar copia» vuelve a cargar un `.json`.
- Si se cierra la app a mitad de sesión, aparece «Sesión sin terminar» para continuar.

## Nutrición
Pestaña «Nutrición»: diario por día (desayuno, comida, merienda, cena, otros), calorías y macros frente a tus objetivos, agua y peso corporal.
Calculadora orientativa de objetivos (Mifflin-St Jeor), biblioteca de alimentos editable, recientes para repetir y copia de entradas a otro día.
Todo entra en la copia `.json`, en el `.md` y en el `.csv` de comidas.

## Paisajes por estaciones
La portada muestra un paisaje ilustrado con un deportista animado: invierno (nieve y esquí de fondo), primavera (prados y ciclismo), verano (playa y flexiones) y otoño (bosque dorado y carrera).
Cambia solo según la fecha; con el botón del paisaje (arriba) puedes fijar la estación que quieras. Respeta «reducir movimiento» del sistema.

### Fotos reales
En el botón del paisaje, sección «Tus fotos reales», puedes elegir una foto de tu galería para cada estación. Se reduce y se guarda solo en tu dispositivo (IndexedDB); con la foto puesta siguen cayendo nieve, pétalos u hojas. «Quitar» devuelve el paisaje ilustrado. Para incluir fotos fijas dentro de la app, rellena `EMBEDDED` en `app.js`.

### Fotos incluidas
`photos/` trae fotos de las cuatro estaciones que se alternan solas cada pocos segundos (`photos.js` lista las de cada estación; añade o quita rutas ahí). Todas las estaciones tienen fotos; el paisaje ilustrado queda como respaldo. Si eliges una foto propia en la app, esa tiene prioridad.

## Perfil y Salud
- **Registro:** al abrir la app por primera vez se pide nombre, apellidos, correo y edad (14–100) y la aceptación de guardar los datos en el dispositivo. «Ahora no» lo pospone; también se puede crear después desde la pestaña Salud. Si alguien abre la app desde un enlace de entreno compartido, no se le interrumpe con el registro.
- **Cuestionario de entrenador (3 pasos):** cuerpo (sexo, altura, peso y, opcionales, % grasa, cintura y pulsaciones en reposo), objetivo (meta, experiencia, días y tiempo, lugar, actividad diaria, lesiones) y salud (PAR-Q de 7 preguntas, medicación, sueño, tabaco, alcohol, alergias). Cada paso se puede omitir y retomar desde Salud.
- **Salud:** perfil con IMC orientativo, aviso si alguna respuesta del PAR-Q es «sí», registro de sueño (acostarse/despertar y calidad) con gráfico de 7 días, y medidas (peso, cintura, % grasa y FC en reposo) con evolución. El peso se comparte con Nutrición y los objetivos de calorías se calculan con los datos del perfil si aún no los habías configurado.
- **Privacidad:** todo está en `localStorage` (claves `intervalo.profile.v1` y `intervalo.health.v1`). No hay cuentas, servidor ni verificación del correo. «Borrar mi perfil y datos de salud» lo elimina. La copia .json incluye perfil y salud; el resumen .md no incluye el correo.

## Fase 2 · Recuperación y rendimiento
- **Check-in diario:** tres barras (sueño, fatiga/agujetas, energía y ánimo). Al empezar una sesión de gimnasio por primera vez en el día se pide en 10 s (se puede saltar). Si la preparación sale baja, se propone una *sesión ligera* (−1 serie por ejercicio y −10 % de peso); nunca se impone.
- **RIR por serie:** tras cada serie puedes marcar cuántas repeticiones te quedaban (0–4+). Se guarda en el historial y en las exportaciones (.csv/.md/.json).
- **Peso sugerido (sin IA):** al abrir un ejercicio se calcula con reglas a partir de tu última sesión: sube (~5 %, entre 1,25 y 5 kg) si completaste todas las repeticiones con ≥3 de reserva, mantiene si va bien, y baja un 5 % si se te quedó muy pesado.
- **Suplementos:** lista propia (nombre, dosis tal como la tomas y momento), marcado diario con un toque y adherencia de 7 días. No da pautas de dosis.
- **Objetivo semanal flexible** (según los días de tu perfil) con semanas seguidas, y avisos: subida de volumen (>30 % sobre tu media), 6 semanas sin descarga y 3 días seguidos de fatiga alta.

## Entrenador IA, medicación, mapa muscular y resumen (v11)

- **Entrenador personal (IA)**: pestaña Salud → «Entrenador personal». Cruza tu perfil, entrenos, RIR, sueño, check-in, nutrición y suplementos para analizar tu semana. **Solo existe dentro del artefacto de claude.ai** (usa la capacidad `sample`; el uso de IA cuenta contra la cuenta de quien lo usa). En la PWA alojada fuera de claude.ai la tarjeta no aparece; el resto funciona igual.
- **Medicación**: registro diario de lo que tomas (solo control, sin ninguna recomendación). Va aparte de los suplementos y entra en el CSV de salud (`medicacion`).
- **Mapa muscular** (Historial): series de los últimos 7 días por grupo, estimadas por el nombre del ejercicio (gris 0 · azul <6 · verde <20 · rojo ≥20 series) y aviso de grupos sin trabajar o con mucho volumen.
- **Resumen mensual**: tarjeta PNG 1080×1350 con kilos, sesiones, series, minutos, ejercicio estrella y mejor progreso. Se guarda como imagen (o se comparte con el menú del sistema si el navegador lo permite).
- **Récords y 1RM estimado**: al terminar una sesión se avisa de nuevos récords; 1RM con la fórmula de Epley (series de 1 a 12 repeticiones).
- **Recordatorio de copia de seguridad**: aviso en Historial si llevas 14 días sin exportar el JSON.

## Mejoras v13

- **Calculadora de discos** en el modo gimnasio: debajo de la sugerencia muestra qué discos poner por lado (barra de 20 kg por defecto; toca el aviso para cambiar a 15, 10 o 0 kg).
- **Progreso por ejercicio** (Historial): 1RM estimado a lo largo del tiempo con selector de ejercicio.
- **Semana pasada** (Historial): sesiones, series y kilos frente a la semana anterior.
- **«Toca hoy»** en Entrenos: marca el entreno de gimnasio que llevas más tiempo sin hacer, y cada tarjeta indica cuándo lo hiciste por última vez.

## Mejoras v14

- **Alimentos**: ~40 alimentos nuevos (varios tipos de pan, tostadas, cereales, embutidos, café con leche…) que se añaden una sola vez a tu biblioteca sin tocar los tuyos, y una fila **«Otros»** al final de la lista que abre «Nuevo alimento» (con lo que hayas buscado ya escrito como nombre).
- **Añadir una sesión ya hecha** (Historial → «+ Sesión hecha»): fecha y hora, duración, notas, y ejercicios con series, repeticiones o tiempo, peso y descanso; opcionalmente se parte de una sesión guardada. Queda en el historial en su fecha, con récords, mapa muscular y exportaciones.
- **Ejercicios por tiempo** (editor de sesiones de gimnasio → «Por tiempo»): segundos por serie, peso opcional (p. ej. plancha con 15 kg) y descanso. En el modo gimnasio aparece un cronómetro que registra la serie solo al terminar; el CSV tiene nuevas columnas `segundos` y `descanso_s`.

## Reutilizar entrenos (v15)

- **Historial → «Repetir esta sesión»**: arranca una sesión con los ejercicios y pesos de aquella (si existe un entreno guardado con el mismo nombre, se enlaza con él). **«Guardar como entreno»** la convierte en plantilla en Entrenos.
- **Durante la sesión**: «Cambiar ejercicio» (sustituye el actual si aún no has hecho series de él) y «+ Ejercicio» (añade uno al final).
- **Al terminar**: casilla «Actualizar “X” con los pesos y ejercicios de hoy» (o «Guardar también como entreno» si venía de una repetición sin plantilla). Así la próxima vez ya sale con lo nuevo.

## Estaciones para grupos (v16)

En Entrenos → ⋯ de un entreno (intervalos o gimnasio) → **«Empezar en otra estación»**: eliges la estación (1, 2, 3…) y el circuito arranca desde ahí y da la vuelta. Pensado para que un grupo grande empiece a la vez en puestos distintos.

Uso sin cobertura: aloja esta carpeta en cualquier hosting estático con HTTPS (GitHub Pages, Netlify Drop…), abre la URL una vez con datos/wifi, «Añadir a pantalla de inicio» y después funciona sin conexión.

## Intervalos con repeticiones y distancias (v17)

Cada fase de **trabajo** de un entreno por intervalos puede ser por **Tiempo** (cuenta atrás), por **Repeticiones** (con peso opcional) o por **Distancia** (m o km). Las dos últimas no tienen cuenta atrás: se muestra el objetivo en grande y se avanza con **«¡Hecho!»**. Se mide el tiempo real de cada una, que queda en las notas del historial y en la duración total. Sirve para mezclar calistenia con carrera, piscina o boxeo. El enlace de «Compartir» incluye estos datos.

## Ritmo, distancia total y calorías (v18)

- **Ritmo** en las fases por distancia: natación en **s/50 m** y carrera en **min/km** (se elige «Carrera» o «Natación» en cada fase; se detecta por el nombre si es de piscina). Aparece al pulsar «¡Hecho!», en el resumen final y en las notas del historial.
- **Distancia total de la sesión** (suma de las fases por distancia hechas) y **calorías aproximadas** (método MET × peso × tiempo; usa tu último peso registrado o 70 kg si no hay). Salen en el resumen, el historial, el resumen mensual y los exportables (`distancia_m`, `kcal_aprox`). Son estimaciones orientativas.

## Ritmo objetivo (v19)

En las fases por distancia hay un campo **«Ritmo objetivo (opc.)»**: segundos por 50 m en natación, min y seg por km en carrera. Con ritmo, el tiempo estimado de la fase se calcula con él, el objetivo se ve en pantalla durante la fase y al terminar se compara con tu ritmo real.

## Pasar datos entre móviles / direcciones y estado de instalación (v20)

- Los datos se guardan en el navegador **por dirección web**: el artefacto de claude.ai, la web de GitHub Pages y la app instalada en iPhone (que es independiente de Safari) son lugares distintos. Para pasarlos: Historial → Exportar → **«Pasar mis datos a otro móvil o web»** (copiar el texto en un sitio y pegarlo en el otro). Si la app está vacía, en Entrenos aparece **«Restaurar mis datos»**.
- Franja inferior en Entrenos: **«Lista para usar sin conexión»**, botón **Instalar** (Android) o **Cómo instalar** (iPhone) y aviso de **versión nueva**.

## v21
- Historial: tarjeta «Mis récords» (mejor peso y 1RM estimado por ejercicio), buscador y filtros Todas/Gimnasio/Intervalos.

## v22 · Cuenta de Google y sincronización (opcional)
Para que cada persona entre con su Gmail y tenga su historial en cualquier móvil:
1. En https://console.firebase.google.com crea un proyecto (plan gratuito Spark).
2. Build → Authentication → Sign-in method → activa **Google**. En Settings → Authorized domains añade `TU-USUARIO.github.io`.
3. Build → Firestore Database → crear base de datos. En Reglas pega:
   `rules_version = '2'; service cloud.firestore { match /databases/{d}/documents { match /users/{uid} { allow read, write: if request.auth != null && request.auth.uid == uid; } } }`
4. Project settings → Tus apps → Web (</>) → copia `firebaseConfig` y pégalo en `firebase-config.js` (`window.INTERVALO_FIREBASE = {...}`).
5. Sube los archivos a GitHub. En la app: Historial → Exportar → Pasar mis datos → «Entrar con Google».
Cada usuario solo puede leer y escribir su propio documento. La sincronización fusiona (no borra): una sesión eliminada en un móvil puede reaparecer desde otro.
