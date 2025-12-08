import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl"; // importar librería de mapas
import "maplibre-gl/dist/maplibre-gl.css"; // importar estilos mapas
import { api } from "../../api/api";


// Componente mapa
function Map () {
    const mapContainer = useRef(null); // container de mapa
    const map = useRef(null); // mapa
    const markersRef = useRef([]); // markers
    const [lng, setLng] = useState(37.9778); // coordenadas Torrevieja
    const [lat, setLat] = useState(-0.6833); // coordenadas Torrevieja
    const [zoom, setZoom] = useState(14); // zoom
    const [style, setStyle] = // estilo mapa (satélite)
        useState("https://api.maptiler.com/maps/019a6b22-5021-75fc-9452-2530f937c6dc/style.json?key=Yu7DuOP1wu6AkLyJkHAt");
    const [area, setArea] = useState("L3906629"); // Área a mostrar
    const [marker, setMarker] = useState(null); // marker
    const [birds, setBirds] = useState([]); // Birds list
    const [is3D, setIs3D] = useState(false); // cambio 3D/2D

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
            center: [lng, lat],
            zoom: zoom,
            pitch: 0,
            bearing: 0
        });

        map.current.addControl(new maplibregl.NavigationControl());
    }, []);


    // Añadimos markers al actualizar observations
    useEffect(() => {
        if (!map.current) return;
        if (!birds || birds.length === 0) return;

        // Eliminamos markers anteriores
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        birds.forEach(obs => {
        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
            <strong>${obs.comName}</strong> (${obs.sciName})<br/>
            Location: ${obs.locName}
        `);

        const marker = new maplibregl.Marker({ color: "#e74c3c" })
            .setLngLat([obs.lng, obs.lat])
            .setPopup(popup)
            .addTo(map.current);

        markersRef.current.push(marker);
        });

        // Centrar el mapa por primer avistamiento
        map.current.flyTo({ center: [birds[0].lng, birds[0].lat], zoom: 13 });

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

    // 3D-buildings
    /*const add3DBuildings = () => {
        if (!map.current) return;
        if (!map.current.getSource("openmaptiles")) {
        map.current.addSource("openmaptiles", {
            type: "vector",
            url: "https://demotiles.maplibre.org/tiles/tiles.json"
        });
        }
        if (!map.current.getLayer("3d-buildings")) {
        map.current.addLayer({
            id: "3d-buildings",
            source: "openmaptiles",
            "source-layer": "building",
            type: "fill-extrusion",
            paint: {
            "fill-extrusion-color": "#aaa",
            "fill-extrusion-height": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                0,
                16,
                ["get", "render_height"]
            ],
            "fill-extrusion-opacity": 0.6
            }
        });
        }
    };*/

    // Cambiar a 3D
    const toggle3D = () => {
        if (!map.current) return;
        if (!is3D) {
        map.current.setPitch(60);
        map.current.setBearing(-45);
        //   add3DBuildings();
        } else {
        map.current.setPitch(0);
        map.current.setBearing(0);
        if (map.current.getLayer("3d-buildings")) map.current.removeLayer("3d-buildings");
        }
        setIs3D(!is3D);
    };

    return (
        <>
            <button onClick={toggle3D}>{is3D ? "Vista 2D" : "Vista 3D"}</button>
            <select onChange={(e) => setStyle(e.target.value)} value={style}>
                <option value="https://api.maptiler.com/maps/019a6b22-5021-75fc-9452-2530f937c6dc/style.json?key=Yu7DuOP1wu6AkLyJkHAt">Satélite</option>
                <option value="https://api.maptiler.com/maps/openstreetmap/style.json?key=Yu7DuOP1wu6AkLyJkHAt">Calles</option>
            </select>
            <select onChange={(e) => setArea(e.target.value)} value={area}>
                <option value="L3906629">Lagunas de La Mata y Torrevieja</option>
                <option value="L3905205">Hondo de Elche</option>
                <option value="L3919198">Salinas de Santa Pola</option>
                <option value="L1121988">Albufera de Valencia</option>
            </select>
            <div ref={mapContainer} style={{ width: "80vw", height: "80vh" }}/>
        </>
    );
};

export default Map;
