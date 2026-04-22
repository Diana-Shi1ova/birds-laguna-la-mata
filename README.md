<!-- # React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project. -->

# Iniciar aplicación
Backend:
```bash
cd backend
npm i              # instalación de dependencias
npm start
```

Frontend:
```bash
cd frontend
npm i              # instalación de dependencias
npm run dev
```

# Estructura del proyecto
## Componentes clave
```bash
/backend
    /config                  # ficheros de configuración
        db.js                # conexión a la base de datos
    /controllers             # funcionalidad de rutas API
    /middleware              # intermediarios
        authMiddleware.js    # verificación de autenticación
    /models                  # esquemas de datos de la BD
    /routes                  # definición de rutas API
    server.js                # servidor

/frontend
    /src
        /api
            api.js        # conexión a la API
        /assets           # imágenes decorativas
        /components       # componentes reusables
        /layouts          # maquetado
        /pages            # páginas
        App.css           # estilos generales
        App.jsx           # enrutado de la app
        index.css         # variables CSS
        main.jsx          # punto de entrada
    index.html            # plantilla HTML principal
```
## Pages
|Página|Descripción|
|------|-----------|
|**Index**|Página principal|
|**Catalog**|Página de catálogo de todas las especies de aves|
|**Favourites**|Página de especies guardadas por el usuario|
|**Graphs**|Página de gráficas que describen la dinámica de aparición de las especies|
|**Login**|Página para iniciar sesión|
|**Register**|Página para registrarse|

## Components
|Componente|Descripción|
|------|-----------|
|**BirdCard**|Componente para listar especies|
|**Button**|Componente botón (con texto y fondo o solo icono sin fondo)|
|**FiltersPannel**|Componente con el formulario para filtrar avistamientos|
|**Header**|Componente con icono de usuario y barra de búsqueda que se ubica arriba|
|**Input**|Componente campos para introducir información de diferentes tipos (texto, números, fechas, etc.)|
|**Map**|Componente mapa que muestra los avistamientos|
|**MarkerInfoCard**|Componente-popup del mapa que visualiza el avistamiento (nombre de ave, foto, etc.)|
|**Pagination**|Componente paginación|
|**Searchbar**|Componente barra de búsqueda|
|**Sidebar**|Componente barra lateral para la navegación entre diferentes|
|**SiteTitle**|Componente para mostrar diferentes títulos en la pestaña al abrir diferentes páginas (no renderiza nada)|
|**UserIcon**|Componente icono de usuario en el header|

## Layouts
|Layout|Descripción|
|------|-----------|
|**FormLayout**|Formulario centrado (login y registro)|
|**GridLayout**|Lista elementos horizontalmente|
|**MainLayout**|Sidebar + contenido principal horizontalmente|

# Descripción de API
|Método|Ruta|Descripción|
|------|----|-----------|
|GET|eBird/|Obtener avistamientos recientes (últimos 30 días) de aves fitrados para el parque indicado de [eBird](https://ebird.org/)
|GET|eBird/history|Obtener avistamientos de aves fitrados para el parque indicado y en una fecha indicada de [eBird](https://ebird.org/)
|GET|eBird/history/range|Obtener avistamientos fitrados para el parque indicado en un rango de fechas de [eBird](https://ebird.org/)