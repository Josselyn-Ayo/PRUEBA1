# Gastro Map — Autenticación con Supabase

Resumen de cambios realizados para implementar el Requerimiento 1 (Autenticación con Supabase):

- **Cliente Supabase:** Se agregó `app/lib/supabase.ts` que crea y exporta el cliente de Supabase usando las variables de entorno `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- **Proveedor de autenticación (AuthProvider):** Se agregó `app/auth/AuthProvider.tsx` que:
  - Expone el hook `useAuth()` con `user`, `loading`, `signIn`, `signUp` y `signOut`.
  - Escucha cambios de estado de autenticación de Supabase y persiste la sesión en `AsyncStorage` en la llave `@gastro:session`.
  - Redirige automáticamente a `/` (Home) cuando hay sesión válida y a `/login` cuando se cierra sesión.
- **Pantallas:** Se agregaron dos pantallas de rutas:
  - `app/login.tsx` — Formulario con `email` y `password` para iniciar sesión.
  - `app/register.tsx` — Formulario con `email`, `password` y `confirmar contraseña`. Valida que las contraseñas coincidan antes de enviar.
 - **Almacenamiento local por usuario:** Se agregó `app/lib/storage.ts` con helpers `setUserData`, `getUserData` y `removeUserData` que guardan datos en `AsyncStorage` usando claves por usuario (`@gastro:user:{userId}:{key}`).
- **Integración en layout:** Se actualizó `app/_layout.tsx` para envolver la app con `AuthProvider`, de forma que el estado de autenticación esté disponible globalmente y las redirecciones automáticas funcionen.

Dependencias requeridas (instalarlas si no están aún):

```bash
npm install @supabase/supabase-js @react-native-async-storage/async-storage react-native-reanimated
# Instala UniWind siguiendo la guía: https://docs.uniwind.dev/
```

Notas de integración y recomendaciones:

- Variables de entorno: las variables ya deben estar en el archivo `.env` en la raíz: `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- `AuthProvider` usa el listener `supabase.auth.onAuthStateChange` para mantener la sesión y redirigir. El proveedor también persiste una versión reducida del usuario en `AsyncStorage`.
- Rutas y navegación: las pantallas `login` y `register` están en la raíz (`/login`, `/register`). El Home existente en `(tabs)` permanecerá en `/` — al iniciar sesión el `AuthProvider` hace `router.replace('/')`.
 - Interfaz: se utilizaron `react-native-reanimated` para entradas animadas; se dejó espacio para integrar UniWind para utilidades de estilo. Sigue https://docs.uniwind.dev/ para la configuración e integración en Expo.

Comprobaciones manuales sugeridas después de instalar dependencias:

1. Ejecutar la app con `npm start` (o `expo start`).
2. Abrir `/login`, registrarse con un email válido y contraseña.
3. Verificar que tras el `signUp`/`signIn` el app redirige a Home (`/`) y que al hacer `signOut()` (por ejemplo, llamándolo desde una pantalla) devuelve a `/login`.

Archivos añadidos/actualizados:

- Añadidos:
  - `app/lib/supabase.ts`
  - `app/auth/AuthProvider.tsx`
  - `app/login.tsx`
  - `app/register.tsx`
  - `app/lib/storage.ts`
  - `docs/authentication.md` (este archivo)

- Modificados:
  - `app/_layout.tsx` — ahora envuelto en `AuthProvider`.

Si quieres, puedo:

- Añadir un botón de `Logout` visible en la pantalla principal (o en un menú) que use `useAuth().signOut()`.
- Integrar UniWind y aplicar utilidades de estilo a las pantallas para una UI más vistosa (ver https://docs.uniwind.dev/).
- Añadir validaciones adicionales (email válido, reglas de contraseña) y manejo de errores más detallado.
