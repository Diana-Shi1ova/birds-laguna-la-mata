# Descripción general
# Avistory

Avistory es una aplicación web para la monitorización de aves en espacios naturales de la Comunidad Valenciana.

Actualmente, la aplicación trabaja con los siguientes espacios naturales:
- Lagunas de La Mata y Torrevieja  
- El Hondo de Elche  
- Salinas de Santa Pola  
- La Albufera de Valencia  

## Funcionalidades principales

La aplicación permite visualizar avistamientos de aves procedentes de dos fuentes de datos:
- API de eBird  
- Sensores IoT (audio e imagen) instalados en El Hondo de Elche  

Además, ofrece un sistema de filtrado avanzado de observaciones, que incluye:
- Filtrado por especie (nombre común o científico)  
- Filtrado por período de tiempo o fecha concreta  
- Filtrado por fuente de datos  

## Análisis y visualización

Avistory no solo muestra datos, sino que también permite:
- Analizar la dinámica de biodiversidad en cada parque  
- Visualizar la evolución temporal de cada especie en un entorno concreto  
- Explorar tendencias mediante gráficas y estadísticas  

## Funcionalidades adicionales

La aplicación también incluye:
- Catálogo de especies de la Comunidad Valenciana  
- Sistema de autenticación de usuarios  
- Funcionalidad de favoritos para guardar especies de interés  y poder realizar un filtrado rápido por las mismas

# Iniciar aplicación
Backend:
```bash
cd backend
npm i              # instalación de dependencias
npm run dev
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
            api.js           # conexión a la API
        /assets              # imágenes decorativas
        /auth                # información sobre autenticación y funciones
        /components          # componentes reusables
        /contexts            # información y funciones que se comparten por varios componentes
        /layouts             # maquetado
        /locales             # ficheros JSON de internacionalización
        /pages               # páginas
        App.css              # estilos generales
        App.jsx              # enrutado de la app
        i18n.js              # configuración de internacionalización
        index.css            # variables CSS
        main.jsx             # punto de entrada
    index.html               # plantilla HTML principal
```
## Pages
|Página|Descripción|
|------|-----------|
|**Index**|Página principal|
|**Catalog**|Página de catálogo de todas las especies de aves|
|**Favourites**|Página de especies guardadas por el usuario|
|**Statistics**|Página de gráficas que describen la dinámica de aparición de las especies|
|**Login**|Página para iniciar sesión|
|**Register**|Página para registrarse|

## Components
|Componente|Descripción|
|------|-----------|
|**BirdCard**|Componente para listar especies|
|**BirdCarousel**|Componente-carrusel de especies|
|**Button**|Componente botón (con texto y fondo o solo icono sin fondo)|
|**ButtonFavourite**|Componente botón que guarda especies y las elimina de favoritos|
|**ButtonInfo**|Componente botón que muestra mensajes informativos|
|**ButtonStatistics**|Componente botón que coge el identificador de la especie y navega a la página de estadísticas de la misma|
|**Chart**|Componente sección con un gráfico lineal|
|**Chips**|Componente lista de valores introducidos en un campo|
|**Dialog**|Componente botón que abre un diálogo personalizable|
|**FiltersPannel**|Componente con el formulario para filtrar avistamientos|
|**Header**|Componente con icono de usuario y barra de búsqueda que se ubica arriba|
|**Input**|Componente campo para introducir información principalmente textual, aunque se puede especificar el tipo (texto, password, email, etc.)|
|**InputCheckbox**|Componente checkbox personalizado|
|**InputDate**|Componente date personalizado|
|**InputNumber**|Componente number personalizado|
|**InputRadiobutton**|Componente radiobutton personalizado|
|**InputSelect**|Componente select personalizado|
|**LanguageSelector**|Componente selector el idioma|
|**Logo**|Componente logotipo|
|**Map**|Componente mapa que muestra los avistamientos|
|**MarkerInfoCard**|Componente-popup del mapa que visualiza el avistamiento (nombre de ave, foto, etc.)|
|**Pagination**|Componente paginación|
|**ResultsList**|Componente lista de sugerencias que aparece durante la búsqueda|
|**Searchbar**|Componente barra de búsqueda|
|**Sidebar**|Componente barra lateral para la navegación entre diferentes|
|**SiteTitle**|Componente para mostrar diferentes títulos en la pestaña al abrir diferentes páginas (no renderiza nada)|
|**Spinner**|Componente indicador de carga|
|**StatisticsCircle**|Componente que visualiza datos estadísticos dentro de un círculo|
|**Tabs**|Componente que permite visualizar panel con pestañas (diferentes de las pestañas de la barra lateral (Sidebar))|
|**UserIcon**|Componente icono de usuario en el header|

## Layouts
|Layout|Descripción|
|------|-----------|
|**FormLayout**|Formulario centrado (login y registro)|
|**GridLayout**|Lista elementos horizontalmente|
|**MainLayout**|Sidebar + contenido principal horizontalmente|

## Contexts
|Context|Descripción|
|------|-----------|
|**BirdsProvider**|Gestión de datos de avistamientos: obtención, filtrado, etc.|
|**SearchUIProvider**|Gestión de estados de la barra de búsqueda|

# Descripción de API

| Método | Ruta | Descripción | Parámetros |
|---|---|---|---|
| GET | `/eBird` | Obtiene observaciones recientes de [eBird](https://ebird.org/) en un parque | `parkId` (obligatorio), `back`, `locale` |
| GET | `/eBird/history` | Obtiene observaciones históricas de [eBird](https://ebird.org/) en una fecha concreta | `parkId` (obligatorio), `date` (obligatorio), `locale` |
| GET | `/eBird/:specieId` | Obtiene observaciones recientes  de [eBird](https://ebird.org/) de una especie concreta | `parkId` (obligatorio), `back`, `locale` |
| GET | `/bird` | Obtiene especies de la Comunidad Valenciana con paginación y búsqueda | `page`, `limit`, `name`, `locale` |
| GET | `/bird/:id` | Obtiene una especie por identificador | `locale` |
| GET | `/bird/wikidata` | Obtiene información de Wikidata de una especie | `sciName`, `locale` |
| GET | `/favourite/:userId` | Obtiene especies guardadas por el usuario | `page`, `limit`, `name`, `locale` |
| POST | `/favourite` | Guarda una especie en favoritos | `userId`, `specieId` |
| DELETE | `/favourite/:id` | Elimina una especie de favoritos | - |
| GET | `/park` | Obtiene todos los parques | - |
| GET | `/park/:id` | Obtiene un parque por identificador | - |
| POST | `/user` | Registro de usuario | `name`, `email`, `password` |
| POST | `/user/login` | Inicio de sesión | `email`, `password` |
| GET | `/raspberry` | Obtiene sensores IoT con filtros | `parkId`, `type`, `date`, `period`, `names` |
| GET | `/raspBird/audio/:id` | Obtiene detecciones de sensores de audio | `date`, `period`, `names` |
| GET | `/raspBird/image/:id` | Obtiene detecciones de sensores de imagen | `date`, `period`, `names` |
| GET | `/raspBird/total/:parkId` | Calcula cantidad total de detecciones IoT | `date`, `period`, `names` |
| GET | `/statistics/park/:id` | Obtiene estadísticas de un parque | `locale` |
| GET | `/statistics/specie/:id` | Obtiene estadísticas de una especie | `parkId` |

## Rutas auxiliares

| Método | Ruta | Descripción | Parámetros |
|---|---|---|---|
| POST | `/eBird/species` | Descarga, procesa y almacena especies desde eBird y Wikidata | - |
| POST | `/statistics` | Precalcula estadísticas y las guarda en la base de datos | - |