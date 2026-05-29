# Best Practices para apps Next.js de bienes raíces

## Arquitectura

- Reutiliza componentes desde el inicio.
- Separa datos, lógica y presentación.
- Centraliza tipos y contratos de datos.
- Mantén mocks y contenido de prueba fuera de la UI.
- Diseña pensando en escalar a favoritos, comparadores y leads.

## Home y navegación

- Haz que la Home sea una página de descubrimiento.
- Prioriza hero, búsqueda, featured y colecciones.
- Usa secciones con jerarquía visual clara.
- Mantén CTAs específicos y orientados a conversión.
- Agrega señales de confianza como Featured, Verified o New Arrival.

## Cards y contenido

- Dale más peso a la fotografía que al texto.
- Haz cards escaneables en pocos segundos.
- Muestra precio, ubicación y atributos clave primero.
- Usa jerarquía tipográfica estricta.
- Evita saturar las cards con demasiados datos.

## Búsqueda y filtros

- Mantén filtros simples y persistentes.
- Soporta búsqueda por ubicación, título y categoría.
- Optimiza para intención exploratoria, no exacta.
- Asegura buen uso en móvil con drawer o panel compacto.
- Conserva el contexto cuando el usuario ajusta filtros.

## Featured

- Define una regla clara para marcar propiedades destacadas.
- Usa una sola fuente de verdad para featured.
- Aplica la bandera de forma consistente en cards y secciones.
- No dupliques modelos si una bandera resuelve el caso.

## Rendimiento y UX

- Optimiza imágenes desde el inicio.
- Usa paginación o carga diferida en listados largos.
- Incluye estados vacíos útiles.
- Agrega estados de carga suaves.
- Evita sobrecargar la primera vista.

## SEO y accesibilidad

- Usa títulos, metadata y estructura semántica claras.
- Crea rutas pensadas para intención de búsqueda.
- Añade datos estructurados cuando aporte valor.
- Cuida contraste, foco visible y navegación por teclado.
- Usa `alt` descriptivos y botones reales.

## Diseño y mantenimiento

- Mantén una identidad visual consistente y premium.
- Usa una paleta corta y espaciado generoso.
- Prefiere configuración centralizada para colores y sombras.
- Mantén el copy corto y orientado a confianza.
- Trabaja con datos de ejemplo realistas y coherentes.