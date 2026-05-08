# Gastro Map — Gestión de Platos (AsyncStorage)

Resumen:

- Se añadió el tipo `Dish` en `app/lib/types.ts`.
- La pantalla Home (`app/(tabs)/index.tsx`) ahora carga los platos del usuario desde `AsyncStorage` con la clave `@gastro:user:{userId}:dishes` usando los helpers en `app/lib/storage.ts`.
- Al agregar un plato se intenta obtener la ubicación actual (si el entorno lo permite) y se **preprende** el nuevo plato al inicio de la lista. La lista se persiste por usuario.

Notas técnicas:

- Si el entorno no proporciona geolocalización (o falla), `latitude`/`longitude` quedarán `null`.
- Para una geolocalización más robusta en Expo se recomienda instalar `expo-location` y solicitar permisos explícitos.

- Requerimientos adicionales implementados:
	- El registro de plato ahora exige que **ningún campo quede vacío**: `nombre`, `descripción` y **foto** son obligatorios.
	- El usuario puede elegir entre `Tomar foto` (cámara) o `Elegir de galería` (usa `expo-image-picker`).
	- La ubicación GPS se solicita y captura en el momento de presionar `Registrar` (usa `expo-location`).

Instalación de dependencias necesarias:

```bash
npm install expo-image-picker expo-location
expo install @react-native-async-storage/async-storage
```

Recuerda: si usas Expo Go algunos módulos nativos pueden no estar presentes; para pruebas con módulos nativos usa un dev client o build con EAS si es necesario.

Comandos recomendados:

```bash
# Instalar dependencias necesarias
npm install expo-location

# Reiniciar Metro
expo start -c
```
