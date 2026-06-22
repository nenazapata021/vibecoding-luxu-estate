# Directorio de Propiedades

Aplicación web para consultar, filtrar y visualizar propiedades inmobiliarias.  
El proyecto permite explorar inmuebles mediante filtros, paginación, imágenes y páginas de detalle.

## Características

- Listado de propiedades inmobiliarias.
- Filtros para buscar propiedades.
- Paginación de resultados.
- Visualización de imágenes de cada propiedad.
- Página de detalle por propiedad usando `slug`.
- Integración con Supabase para almacenar y consultar datos.
- Diseño responsive para computador, tablet y móvil.

## Tecnologías utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- ESLint

## Estructura del proyecto

```text
├── app/                 # Rutas, páginas y componentes de Next.js
├── antigravity/         # Componentes o configuraciones adicionales del proyecto
├── lib/                 # Funciones auxiliares y lógica de acceso a datos
├── public/              # Imágenes, íconos y archivos públicos
├── supabase/            # Configuración, consultas y recursos de Supabase
├── .gitignore           # Archivos ignorados por Git
├── eslint.config.mjs    # Configuración de ESLint
├── next.config.ts       # Configuración de Next.js
├── package.json         # Dependencias y scripts del proyecto
├── postcss.config.mjs   # Configuración de PostCSS
└── tsconfig.json        # Configuración de TypeScript
