# TodoList App

Este repositorio contiene una aplicación ToDo construida con Angular, Ionic y Capacitor.

## Resumen tecnológico

- Componente / Framework Principal: **Angular v20** (según `package.json`)
- Lenguaje: **TypeScript**
- Interfaz UI: **Ionic Angular v8** (`@ionic/angular`)
- Contenedor Nativo: **Capacitor v8** (`@capacitor/core` y `@capacitor/cli`)
- Gestión de Estado: **RxJS BehaviorSubject** (en `src/app/services/task.service.ts`)
- Persistencia: **localStorage** (tareas y credenciales almacenadas localmente)

> Nota: inicialmente el proyecto fue adaptado para Angular v20; si tu entorno esperaba Angular 15, asegúrate de alinear las versiones antes de instalar.

---

## Requisitos

- Node.js (recomendado: Node 18+)
- npm (incluido con Node)
- Ionic CLI (opcional, pero recomendado globalmente):

```powershell
npm install -g @ionic/cli
```

- (Opcional) Capacitor CLI globalmente si vas a construir para dispositivos reales:

```powershell
npm install -g @capacitor/cli
```

## Instalación de dependencias

Desde la raíz del proyecto (donde está `package.json`), ejecutar:

```powershell
npm install
```

Esto generará/actualizará `package-lock.json`. Si estás en un entorno CI prefieres reproducibilidad, usa `npm ci`.

## Ejecutar en modo web (navegador)

1. Instala dependencias si no lo hiciste:

```powershell
npm install
```

2. Inicia la app en modo desarrollo con Ionic / Angular:

```powershell
ionic serve
```

o, si no usas la CLI global, también funciona con npm:

```powershell
npm run start
```

3. Abre `http://localhost:8100` (o la URL que indique la CLI).

## Visualizar en modo "teléfono" (simular con F12)

Para que el ingeniero que te evalúe vea la vista móvil (cuando presionan F12):

1. Abre la app con `ionic serve` y carga `http://localhost:8100` en Chrome o Edge.
2. Presiona `F12` para abrir las DevTools.
3. Activa el emulador de dispositivo (ícono de dispositivo / `Toggle device toolbar`), o usa `Ctrl+Shift+M`.
4. Selecciona un dispositivo (iPhone, Pixel, etc.) en la barra superior de DevTools.
5. Recarga la página (F5) si hace falta para aplicar dimensiones y user-agent.

Consejos:
- Puedes alternar red (offline/slow) y rotación para probar distintos estados.
- Asegúrate de limpiar cache (Ctrl+F5) si pruebas cambios y no se ven reflejados.

## Probar en emulador o dispositivo real (opcional)

Para empaquetar con Capacitor y probar en un emulador o dispositivo real, sigue estos pasos:

1. Compilar la app web:

```powershell
npm run build
```

2. Sincronizar con Capacitor (añade la plataforma si aún no existe):

```powershell
npx cap add android    # si no está añadida
npx cap add ios        # macOS + Xcode necesario para iOS
npx cap sync
```

3. Abrir en Android Studio / Xcode:

```powershell
npx cap open android
npx cap open ios
```

4. Desde Android Studio o Xcode, ejecuta en un emulador o dispositivo conectado.

Nota: Capacitor y los pasos nativos requieren que tengas instaladas las herramientas nativas (Android SDK / Android Studio para Android; Xcode para iOS).

## Tests

Si el proyecto tiene tests configurados (Karma/Jasmine), puedes correr:

```powershell
npm test
```

## Cambios recientes importantes

Los cambios aplicados localmente por mantenimiento incluyen:

- Alineación de dependencias `@angular/*` a `^20.0.0` en `package.json`.
- Corrección en `src/app/dashboard/dashboard.page.ts` y `src/app/dashboard/dashboard.page.html` para usar correctamente el `BehaviorSubject` (`tasks$ | async` en plantilla y lectura desde `.value` en getters).

Si consigues errores del tipo "The current version of \"@angular/build\" supports Angular versions ^20.0.0, but detected Angular version 15.x.x" entonces probablemente tu `node_modules` contiene versiones antiguas: ejecuta `npm install` nuevamente para regenerar el `node_modules` acorde a `package.json`.

## Estado de la arquitectura frente a la lista solicitada

- Framework Principal: **Angular v20** — Cumple (según `package.json`).
- TypeScript — Cumple.
- Interfaz UI: **Ionic Angular v8** — Cumple.
- Contenedor Nativo: **Capacitor v8** — Cumple.
- Gestión de Estado: **NO cumple** con "Angular Signals"; actualmente se usa **RxJS BehaviorSubject** en `src/app/services/task.service.ts`.
- Persistencia de Datos: **localStorage** — Cumple.

Si deseas que la gestión de estado pase a Angular Signals (para alinear exactamente con la especificación), puedo realizar la migración automática de `BehaviorSubject` a `signal()` y ajustar los componentes.

## Posibles problemas y soluciones

- Error sobre versiones Angular / `@angular/build`: ejecutar `npm install` y verificar que `@angular/*` en `package.json` estén alineados.
- Errores de plantilla por llamar a `BehaviorSubject` como función (ej. `tasks()`): ya fueron corregidos en `dashboard`. Si aparecen errores similares en otras páginas, conviértelos a `Observable | async` o usa `.value` en código TypeScript.

## Commit y push

Después de verificar que todo funciona localmente, sube los cambios al repositorio:

```powershell
git add package.json package-lock.json src/app/dashboard/dashboard.page.ts src/app/dashboard/dashboard.page.html README.md
git commit -m "chore: update Angular to v20, fix dashboard observable usage, add README"
git push origin <tu-rama>
```

## ¿Quieres que haga la migración a Angular Signals?

Si quieres que convierta la gestión de estado a Angular Signals y actualice componentes, responde `Sí, migrar a Signals` y lo hago (haré los cambios y pruebas locales necesarias).

---

Si quieres que ajuste el README (más detalles, imágenes, o pasos para CI), dime qué agregar y lo actualizo.