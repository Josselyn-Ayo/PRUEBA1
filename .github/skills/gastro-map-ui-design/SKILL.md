# SKILL: GASTRO MAP - DOMINO'S BRAND ENGINE (Tailwind Edition)

## 1. Identidad Visual (Basada en imagen_0fea16.png)
Aplica la identidad de Domino's Pizza usando EXCLUSIVAMENTE clases de NativeWind:

### Paleta de Colores
- **Primario (Bahama Blue):** `bg-[#006391]` / `text-[#006391]`
- **Secundario (Crimson):** `bg-[#E21837]` / `text-[#E21837]`
- **Fondo (Wild Sand):** `bg-[#F5F5F5]`
- **Card/Superficie:** `bg-white`
- **Texto Base:** `text-[#333333]`

### Estilo Visual
- **Botones:** `bg-[#006391] p-4 rounded-sm`. Texto: `text-white font-bold uppercase text-center`.
- **Inputs:** `border-[#006391] border-2 p-3 rounded-sm bg-white`.
- **Contenedores:** Shadow moderada y fondos `bg-white` con `rounded-sm`.
- **Animaciones:** Integrar Layout Animations de Reanimated (`FadeInDown`).

## 2. Reglas Técnicas del Examen
- **Framework:** React Native + Expo Router.
- **Estilos:** PROHIBIDO el uso de `StyleSheet.create`. Usar solo clases de Tailwind/NativeWind.
- **Estado:** TanStack Query para persistencia y caché.
- **Auth:** Implementación obligatoria con Supabase.
- **Tipado:** TypeScript estricto.

## 3. Proceso de Ejecución Inmediata
Al recibir una instrucción de implementación:
1. Analizar el archivo de especificación (ej. `docs/login-spec.md`).
2. Generar el código directamente aplicando los colores `#006391` y `#E21837`.
3. Asegurar que los componentes sean táctiles y responsivos para móvil.
4. Omitir fases de planificación si el usuario solicita entrega directa.

## 4. Checklist de Validación
- [ ] ¿Se usa el azul `#006391` para acciones principales?
- [ ] ¿Los bordes son `rounded-sm` (estilo cuadrado de Domino's)?
- [ ] ¿Se evitó `StyleSheet` al 100%?
- [ ] ¿El tipado TS es estricto?