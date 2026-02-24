import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl"; // importar librería de mapas
import "maplibre-gl/dist/maplibre-gl.css"; // importar estilos mapas
import { api } from "../../api/api";
import MarkerInfoCard from "../MarkerInfoCard/MarkerInfoCard";
import './Map.css';
import { createRoot } from "react-dom/client";


// Componente mapa
function Map () {
    const mapContainer = useRef(null); // container de mapa
    const map = useRef(null); // mapa
    const markersRef = useRef([]); // markers
    const [lng, setLng] = useState(38.01041); // coordenadas Torrevieja
    const [lat, setLat] = useState(-0.70461); // coordenadas Torrevieja
    const [zoom, setZoom] = useState(12); // zoom
    const [style, setStyle] = // estilo mapa (satélite)
        useState("https://api.maptiler.com/maps/019a6b22-5021-75fc-9452-2530f937c6dc/style.json?key=Yu7DuOP1wu6AkLyJkHAt");
    const [area, setArea] = useState("L3906629"); // Área a mostrar
    const [marker, setMarker] = useState(null); // marker
    const [birds, setBirds] = useState([]); // Birds list
    const [is3D, setIs3D] = useState(false); // cambio 3D/2D
    const [raspImage, setRaspImage] = useState();
    const [raspAudio, setRaspAudio] = useState();

    // Array para guardar enlaces a root en useRef
    const rootsRef = useRef([]);

    const parks = {
        "L3906629": { // general
            name: "Lagunas de La Mata y Torrevieja",
            lat: 38.01041,
            lng: -0.70461,
            zoom: 12
            //38.01531,-0.70111
            // L6177434, L6121785, L7241499, L6121783, L3906629
        },
        "L3905205": {
            name: "Hondo de Elche",
            lat: 38.18057,
            lng: -0.74918,
            zoom: 12
            //38.18121,-0.75270
        },
        "L3919198": {
            name: "Salinas de Santa Pola",
            lat: 38.18614,
            lng: -0.61303,
            zoom: 12
            //38.18819,-0.61898
        },
        "L1121988": {
            name: "Albufera de Valencia",
            lat: 39.28346,
            lng: -0.33191,
            zoom: 10
            //39.28032,-0.34112
        }
    };

    // Hacer petición de pájaros
    useEffect(() => {
        // Petición al servidor
        api.get('/eBird', {
            params: { hotspot: area }
        })
        .then(response => {
            console.log(response.data);
            setBirds(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [area]);


    // Inicializar el mapa
    useEffect(() => {
        if (map.current) return;
            map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: style,
            center: [lat, lng],
            zoom: zoom,
            pitch: 0,
            bearing: 0
        });

        map.current.addControl(new maplibregl.NavigationControl());

        // Añadir marcadores de Raspderries

        //38°11'13.6"N 0°47'20.1"W    ->    38.187111, -0.788916
        const audio = new maplibregl.Marker({ color: "#3c94e7" })
                .setLngLat([-0.788916, 38.187111])
                // .setPopup(popup)
                .addTo(map.current);

        // De momento, coordenadas ficticias
        const image = new maplibregl.Marker({ color: "#d8e356" })
                .setLngLat([-0.75299, 38.1811])
                // .setPopup(popup)
                .addTo(map.current);
    }, []);


    // Agrupar aves por coordenadas
    function groupByCoords(observations, precision = 5) {
        return observations.reduce((acc, obs) => {
            const lat = obs.lat.toFixed(precision);
            const lng = obs.lng.toFixed(precision);
            const key = `${lat},${lng}`;

            if (!acc[key]) {
            acc[key] = {
                lat: obs.lat,
                lng: obs.lng,
                items: []
            };
            }

            acc[key].items.push(obs);
            return acc;
        }, {});
    }


    // Mostrar marcadores
    useEffect(() => {
        if (!map.current || !birds?.length) return;

        const grouped = Object.values(groupByCoords(birds));

        grouped.forEach(group => {
            const container = document.createElement("div");
            const root = createRoot(container);
            
            root.render(<MarkerInfoCard birds={group.items} />);
            
            // Guardamos root para poder limpiarlo correctamente
            rootsRef.current.push(root);

            const popup = new maplibregl.Popup({ 
                offset: 25,
                anchor: 'bottom', // Fuerza a que la "punta" del popup esté abajo (el contenido arriba)
            })
                .setDOMContent(container);

            const marker = new maplibregl.Marker({ color: "#e74c3c" })
                .setLngLat([group.lng, group.lat])
                .setPopup(popup)
                .addTo(map.current);

            // Añadimos el evento de centrado
            marker.getElement().addEventListener('click', () => {
                map.current.flyTo({
                    center: [group.lng, group.lat],
                    offset: [0, 200],
                    zoom: 12,      // Ajusta el nivel de zoom deseado al acercarse
                    speed: 0.8,    // Velocidad del vuelo (opcional)
                    curve: 1,      // Suavidad del vuelo (opcional)
                    essential: true // Asegura que la animación se ejecute incluso si el usuario tiene "reduce motion"
                });
            });

            markersRef.current.push(marker);
        });

        // Limpieza
        return () => {
            // Esta función se ejecuta ANTES de la siguiente ejecución del useEffect
            const rootsToCleanup = [...rootsRef.current];
            setTimeout(() => {
                rootsToCleanup.forEach(r => r.unmount());
            }, 0);
        };
    }, [birds]);


    // Cambiar el estilo del mapa
    useEffect(() => {
        if (!map.current) return;
        map.current.setStyle(style);
        map.current.on("style.load", () => {
        if (marker) marker.addTo(map.current);
        if (is3D) add3DBuildings();
        });
    }, [style]);


    // 3D/2D
    const toggle3D = () => {
        if (!map.current) return;

        if (!is3D) {
            // Pasamos a 3D
            map.current.setProjection({
                type: 'globe' // Visualización como globo
            });
            map.current.setPitch(60);
            map.current.setBearing(-45);
            
            // Mostrar todo el planeta
            // map.current.flyTo({ zoom: 1 }); 
            
            // add3DBuildings();
        } else {
            // Volver a 2D
            map.current.setProjection({
                type: 'mercator' // Visualización plana
            });
            map.current.setPitch(0);
            map.current.setBearing(0);
            
            if (map.current.getLayer("3d-buildings")) {
                map.current.removeLayer("3d-buildings");
            }
        }
        setIs3D(!is3D);
    };

    // Mostrar parque
    const showPark = (e) => {
        setArea(e.target.value);

        setLat(parks[e.target.value].lat);
        setLng(parks[e.target.value].lng);
        setZoom(parks[e.target.value].zoom);

        map.current.flyTo({ center: [parks[e.target.value].lng, parks[e.target.value].lat], zoom: parks[e.target.value].zoom});
    }

    return (
        <>
            {/* <MarkerInfoCard></MarkerInfoCard> */}
            <div className="map-controls-container">
                <button onClick={toggle3D}>{is3D ? "Vista 2D" : "Vista 3D"}</button>
                <select onChange={(e) => setStyle(e.target.value)} value={style}>
                    <option value="https://api.maptiler.com/maps/019a6b22-5021-75fc-9452-2530f937c6dc/style.json?key=Yu7DuOP1wu6AkLyJkHAt">Satélite</option>
                    <option value="https://api.maptiler.com/maps/openstreetmap/style.json?key=Yu7DuOP1wu6AkLyJkHAt">Calles</option>
                </select>
                <select onChange={(e) => showPark(e)} value={area}>
                    <option value="L3906629">Lagunas de La Mata y Torrevieja</option>
                    <option value="L3905205">Hondo de Elche</option>
                    <option value="L3919198">Salinas de Santa Pola</option>
                    <option value="L1121988">Albufera de Valencia</option>
                </select>
            </div>
            <div ref={mapContainer} style={{ width: "100%", height: "100vh" }}/>
        </>
    );
};

export default Map;
