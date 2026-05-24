# NexoForm — App Móvil y Web (React Native + Expo)

App de encuestas y solicitudes de servicio para iOS, Android y web, construida con **React Native**, **Expo SDK 54**, **TypeScript** y **Clean Architecture**.

---

## Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Cómo usar con Expo Go](#cómo-usar-con-expo-go)
- [Cómo usar en Web](#cómo-usar-en-web)
- [Credenciales de administrador](#credenciales-de-administrador)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Arquitectura](#arquitectura)
- [Exportación de datos](#exportación-de-datos)
- [Nota de seguridad](#nota-de-seguridad)

---

## Tecnologías

| Tecnología | Versión | Rol |
|---|---|---|
| [Expo](https://expo.dev) | SDK 54 | Plataforma móvil |
| [React Native](https://reactnative.dev) | 0.81.5 | Framework UI nativo |
| [React](https://react.dev) | 19.1.0 | Motor de UI |
| [TypeScript](https://typescriptlang.org) | 5.9.x | Tipado estático |
| [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) | 2.2.0 | Persistencia local |
| [expo-file-system](https://docs.expo.dev/versions/latest/sdk/filesystem/) | ~19.0.22 | Escritura de archivos |
| [expo-sharing](https://docs.expo.dev/versions/latest/sdk/sharing/) | ~14.0.8 | Compartir archivos (CSV/JSON) |
| [react-dom](https://react.dev) | 19.1.0 | Soporte web |
| [react-native-web](https://necolas.github.io/react-native-web/) | ^0.21.0 | Render en navegador |

> **¿Por qué SDK 54 y no 55?**
> Expo Go disponible en App Store y Play Store al momento de este release soporta SDK 54.
> SDK 55 fue lanzado pero está pendiente de aprobación en App Store.
> Con `npx expo install` todas las versiones de dependencias se resuelven automáticamente.

---

## Requisitos previos

- **Node.js** ≥ 18
- **npm** ≥ 9 (o pnpm / yarn)
- **Expo Go** instalado en tu dispositivo iOS o Android
  - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
  - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/survey-app.git
cd survey-app

# 2. Instalar dependencias
npm install

# 2.1 Instalar soporte web si aún no está presente
npx expo install react-dom react-native-web

# 3. Iniciar el servidor de desarrollo
npm start
```

Si más adelante necesitas agregar un paquete administrado por Expo, usa `npx expo install <paquete>` para que se elija una versión compatible con el SDK.

Si estás empezando desde cero en un repositorio vacío, crea primero el repositorio local con `git init` y luego enlaza el remoto de GitHub antes de hacer `git push`.

---

## Cómo usar con Expo Go

1. Ejecuta `npm start` en la terminal.
2. Aparecerá un **código QR** en la terminal.
3. Abre Expo Go en tu teléfono:
   - **Android**: escanea el QR desde la app Expo Go.
   - **iOS**: escanea el QR desde la app Cámara del sistema.
4. La app se cargará en tu dispositivo.

> Asegúrate de que tu computador y tu teléfono estén **en la misma red WiFi**.

## Cómo usar en Web

1. Ejecuta `npx expo start --web` en la terminal.
2. Se abrirá la app en `http://localhost:8081`.
3. Si quieres exportar respuestas desde el panel admin, en web se descargan directo como archivo.

Si `--web` no funciona, revisa que estén instalados `react-dom` y `react-native-web`.

---

## Credenciales de administrador

```
Usuario:    admin
Contraseña: nexo2026
```

Para cambiarlas, edita las constantes en:
```
src/presentation/components/ui/LoginModal.tsx
```

---

## Estructura de carpetas

```
survey-app/
├── App.tsx                             ← Punto de entrada + providers
├── app.json                            ← Configuración de Expo
├── babel.config.js                     ← Aliases de módulos (@domain, @data, @presentation)
├── tsconfig.json
├── package.json
└── src/
    ├── domain/                         ① CAPA DE DOMINIO (pura, sin dependencias externas)
    │   ├── entities/
    │   │   └── SurveyEntry.ts          → Entidad + fábrica
    │   ├── repositories/
    │   │   └── SurveyRepository.ts     → Contrato abstracto (interfaz)
    │   └── usecases/
    │       └── SurveyUseCases.ts       → Submit, GetAll, Delete, Export (lógica pura)
    │
    ├── data/                           ② CAPA DE DATOS (infraestructura)
    │   ├── storage/
    │   │   └── AsyncStorageAdapter.ts  → Lectura/escritura en AsyncStorage
    │   └── repositories/
    │       └── SurveyRepositoryImpl.ts → Implementación concreta del contrato
    │
    └── presentation/                   ③ CAPA DE PRESENTACIÓN (React Native)
        ├── theme/
        │   ├── theme.ts                → Tokens de color, espaciado, tipografía
        │   └── ThemeContext.tsx        → Proveedor + hook useTheme
        ├── hooks/
        │   ├── useSurveyForm.ts        → ViewModel del formulario
        │   └── useAdminEntries.ts      → ViewModel del panel admin
        ├── components/
        │   ├── ui/
        │   │   ├── FormField.tsx       → Campo reutilizable con label y error
        │   │   ├── ThemeToggle.tsx     → Interruptor claro/oscuro animado
        │   │   └── LoginModal.tsx      → Modal de autenticación
        │   ├── layout/
        │   │   └── AppHeader.tsx       → Barra superior con marca y acciones
        │   └── form/
        │       ├── SurveyForm.tsx      → Formulario completo de encuesta
        │       └── SuccessBanner.tsx   → Banner de confirmación de envío
        └── screens/
            └── HomeScreen.tsx          → Pantalla principal (tabs + vistas)
```

---

## Arquitectura

El proyecto sigue **Clean Architecture** con tres capas y la regla de dependencia hacia adentro:

```
Dominio ← Datos ← Presentación
```

### ① Dominio
Núcleo del sistema. Contiene entidades, contratos (interfaces) y casos de uso como funciones puras. No importa nada de React Native, AsyncStorage ni Expo.

### ② Datos
Implementa el contrato `SurveyRepository` usando `AsyncStorage`. Si en el futuro se migra a SQLite o una API REST, solo se cambia `SurveyRepositoryImpl.ts`.

### ③ Presentación
Capa React Native. Usa hooks como ViewModels que conectan la UI con los casos de uso. Los componentes son "tontos": reciben props y llaman callbacks.

### Flujo de envío del formulario

```
Usuario escribe → SurveyForm
                       ↓
              useSurveyForm (hook)
                       ↓
          submitSurveyUseCase (dominio)
                       ↓
        validateFormData → errores o válido
                       ↓
        SurveyRepository.save() → AsyncStorage
```

---

## Exportación de datos

Cuando el admin presiona uno de los botones de exportación:

1. `buildExportContent` (dominio) genera el string del archivo.
2. En **web**, el archivo se descarga directamente desde el navegador.
3. En **móvil**, `Sharing.shareAsync` abre el **sheet nativo** del sistema operativo:
   - En iOS: AirDrop, Mail, Archivos, etc.
   - En Android: Google Drive, WhatsApp, compartir con otras apps, y opciones de guardado según el dispositivo.

---

## Nota de seguridad

Las credenciales de admin están embebidas en el bundle compilado de la app. Un usuario técnico podría extraerlas haciendo reverse engineering del APK/IPA.

Esto es aceptable para:
- Prototipos y demos internas
- Uso offline o en red controlada
- Datos no altamente sensibles

Para producción con datos sensibles, implementar autenticación backend con JWT.
