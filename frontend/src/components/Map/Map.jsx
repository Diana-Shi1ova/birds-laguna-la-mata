import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl"; // importar librería de mapas
import "maplibre-gl/dist/maplibre-gl.css"; // importar estilos mapas
import { api } from "../../api/api";
import MarkerInfoCard from "../MarkerInfoCard/MarkerInfoCard";
import './Map.css';
import { createRoot } from "react-dom/client";
import { useBirds } from "../../contexts/BirdsProvider";
import InputSelect from "../InputSelect/InputSelect";
import { createPortal } from "react-dom";
import MapPopupPortal from "./MapPopupPortal";
import Button from "../Button/Button";
import { FaCog } from "react-icons/fa";
import Dialog from "../Dialog/Dialog";


// Componente mapa
function Map () {
    const mapContainer = useRef(null); // container de mapa
    const map = useRef(null); // mapa
    const markersRef = useRef([]); // markers
    const markersRefRasp = useRef([]); // markers de raspberries
    const [lng, setLng] = useState(38.01041); // coordenadas Torrevieja
    const [lat, setLat] = useState(-0.70461); // coordenadas Torrevieja
    const [zoom, setZoom] = useState(12); // zoom
    const [style, setStyle] = // estilo mapa (satélite)
        useState(`https://api.maptiler.com/maps/019a6b22-5021-75fc-9452-2530f937c6dc/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`);
    //const [area, setArea] = useState("L3906629"); // Área a mostrar
    const [marker, setMarker] = useState(null); // marker
    //const [birds, setBirds] = useState([]); // Birds list
    const [is3D, setIs3D] = useState(false); // cambio 3D/2D
    const [raspImage, setRaspImage] = useState();
    const [raspAudio, setRaspAudio] = useState();

    const [raspberries, setRaspberries] = useState();
    const [parks, setParks] = useState();
    const [parkOptions, setParksOptions] = useState();

    const {
        birds,
        raspberryAudioBirds,
        raspberryImageBirds,
        filteredBirds,
        area,
        setArea,
        searchQuery,
        getRaspberryDetections,
        dateOrPeriod,
        simpleSearch,
        parkData,
        setParkData
    } = useBirds();

    // Array para guardar enlaces a root en useRef
    const rootsRef = useRef([]);
    const rootsRefRasp = useRef([]);
    const [popups, setPopups] = useState([]);
    const [popupsRasp, setPopupsRasp] = useState([]);

    // Estilos del mapa
    const mapStyles = [
        {
            value: `https://api.maptiler.com/maps/019a6b22-5021-75fc-9452-2530f937c6dc/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,
            label: 'Satélite'
        },
        {
            value: `https://api.maptiler.com/maps/openstreetmap/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,
            label: 'Calles'
        }
    ]

    // Obtener raspberries
    useEffect(() => {
        if(!searchQuery.rpa && !searchQuery.rpi) {
            setRaspberries([]);
            addRaspberriesMarkers([]);
            return;
        }

        let type = '';
        if(searchQuery.rpa && !searchQuery.rpi) type = 'audio';
        if(searchQuery.rpi && !searchQuery.rpa) type = 'image';

        const [date,period] = dateOrPeriod();
        api.get('/raspberry', {
            params: {
                // hotspot: area,
                // back: searchQuery.back
                // back: back
                // period: period
                date: date,
                period: period,
                names: searchQuery.species.length>0 ? searchQuery.species.join(',') : simpleSearch,
                parkId: parkData.parkId,
                type: type
            }
        })
        .then(response => {
            console.log(response.data);
            setRaspberries(response.data);
            addRaspberriesMarkers(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [parkData, searchQuery, simpleSearch]);


    // Obtener parques
    useEffect(() => {
        api.get('/park')
        .then(response => {
            console.log(response.data);
            setParks(response.data);
            const options = response.data.map(park => ({
                value: park._id,
                label: park.name
            }));
            setParksOptions(options);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, []);


    // Inicializar el mapa
    useEffect(() => {
        if (map.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: style,
            center: [parkData.long, parkData.lat],
            zoom: parkData.zoom,
            pitch: 0,
            bearing: 0
        });

        map.current.addControl(new maplibregl.NavigationControl());
    }, []);


    // Marcadores de raspberries
    function addRaspberriesMarkers(raspberries, searchQuery) {
        if (!map.current) return;

        // Eliminamos viejos
        markersRefRasp.current.forEach(marker => marker.remove());
        markersRefRasp.current = [];

        // Determinar clase
        let audioClass = 'marker-pulse-audio';
        let imageClass = 'marker-pulse-image';

        raspberries.forEach(rasp => {
            let el = document.createElement('div');

            let dot = document.createElement('div');
            dot.className = 'dot';
            el.appendChild(dot);

            if(rasp.detections){
                let pulse = document.createElement('div');
                pulse.className = 'pulse';
                el.appendChild(pulse);
            }

            el.className =
                rasp.type === "audio"
                ? audioClass
                : imageClass;

            const marker = new maplibregl.Marker({ element: el })
                .setLngLat([rasp.long, rasp.lat])
                // .setPopup(popup)
                .addTo(map.current);

            // Click
            el.addEventListener("click", async () => {
                console.log(rasp._id)

                let data = [];
                data = await getRaspberryDetections(rasp);

                const container = document.createElement("div");

                const popup = new maplibregl.Popup({ offset: 25, anchor: 'bottom' })
                    .setLngLat([rasp.long, rasp.lat])
                    .setDOMContent(container)
                    .addTo(map.current);

                /*const root = createRoot(container);
                root.render(
                    <MarkerInfoCard
                        birds={data}
                        source={rasp.type}
                        long={rasp.long}
                        lat={rasp.lat}
                        popup={popup}
                    />
                );

                    rootsRefRasp.current.push(root);*/
                const newPopup = {
                    container,
                    birds: data,
                    popup,
                    source: rasp.type,
                    long: rasp.long,
                    lat: rasp.lat
                }

                setPopupsRasp([newPopup]);
            });

            markersRefRasp.current.push(marker);
        });
    }


    // Formatear fecha al formato aaaa-mm-dd para hacer petición al API
    function formatDateRaspberries(date = new Date()) {
        const d = new Date(date);

        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');

        return `${yyyy}-${mm}-${dd}`;
    }


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
    /*useEffect(() => {
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
    }, [birds]);*/
    
    useEffect(() => {
        if (!map.current) return;

        // Borramos marcadores antiguos
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Limpiamos contenedores antiguos
        rootsRef.current.forEach(root => {
            const container = root._internalRoot?.containerInfo; // obtener div del contenedor
            if (container) container.innerHTML = "";
        });
        rootsRef.current = [];

        if (!filteredBirds?.length) return;

        // Creamos marcadores nuevos
        const grouped = Object.values(groupByCoords(filteredBirds));

        const newPopups = [];

        grouped.forEach(group => {
            /*const container = document.createElement("div");
            const root = createRoot(container);
            root.render(<MarkerInfoCard birds={group.items} />);
            rootsRef.current.push(root);

            const popup = new maplibregl.Popup({ offset: 25, anchor: 'bottom' })
                .setDOMContent(container);*/

            const container = document.createElement("div");

            const popup = new maplibregl.Popup({ offset: 25, anchor: 'bottom' })
                .setDOMContent(container);

            /*const root = createRoot(container);
            root.render(<MarkerInfoCard birds={group.items} popup={popup} />);
            rootsRef.current.push(root);*/

            const marker = new maplibregl.Marker({ color: "#e74c3c" })
                .setLngLat([group.lng, group.lat])
                .setPopup(popup)
                .addTo(map.current);

            marker.getElement().addEventListener('click', () => {
                map.current.flyTo({
                    center: [group.lng, group.lat],
                    offset: [0, 200],
                    zoom: 12,
                    speed: 0.8,
                    curve: 1,
                    essential: true
                });
            });

            markersRef.current.push(marker);

            newPopups.push({
                container,
                birds: group.items,
                popup
            });
        });

        setPopups(newPopups);
    }, [filteredBirds]);

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
    /*const showPark = (e) => {
        setArea(e.target.value);

        setLat(parks[e.target.value].lat);
        setLng(parks[e.target.value].lng);
        setZoom(parks[e.target.value].zoom);

        map.current.flyTo({
            center: [parks[e.target.value].lng, parks[e.target.value].lat], zoom: parks[e.target.value].zoom ?? map.current.getZoom()});
    }*/
    const showPark = (e) => {
        const selectedCode = e.target.value;

        console.log(selectedCode)

        const park = parks.find(p => p._id === selectedCode);

        if (!park) return;

        setArea(selectedCode);
        setParkData({
            parkId: park._id,
            lat: park.lat,
            long: park.long,
            zoom: park.zoom,
        });

        map.current.flyTo({
            center: [park.long, park.lat],
            zoom: park.zoom ?? map.current.getZoom()
        });
    };


    return (
        <>
            <InputSelect name="park" classAdditional="park-select" options={parkOptions} change={(e) => showPark(e)} selected={parkData.parkId}></InputSelect>
            {/* <div className="map-controls-container"> */}
                {/* <InputSelect name="park" options={parkOptions} change={(e) => showPark(e)} selected={parkData.parkId}></InputSelect> */}
                {/* <Button classAdditional="map-settings"><FaCog /></Button> */}
                
                
            {/* </div> */}
            <Dialog buttonTitle={<FaCog />} buttonTooltip='Opciones del mapa' buttonClass='but-map-options' dialogClass="map-options">
                <h1>Opciones del mapa</h1>
                <InputSelect label={'Estilo del mapa:'} name="mapStyles" options={mapStyles} change={(e) => setStyle(e.target.value)}></InputSelect>
                <Button func={toggle3D}>Vista {is3D ? "2D" : "3D"}</Button>
            </Dialog>
            <div ref={mapContainer} style={{ width: "100%", height: "100vh" }}/>
            {popups.map((p, index) => (
                <MapPopupPortal key={index} container={p.container}>
                    <MarkerInfoCard
                        birds={p.birds}
                        popup={p.popup}
                    />
                </MapPopupPortal>
            ))}
            {popupsRasp.map((p, index) => (
                <MapPopupPortal key={index} container={p.container}>
                    <MarkerInfoCard
                        birds={p.birds}
                        popup={p.popup}
                        source={p.source && p.source}
                        long={p.long}
                        lat={p.lat}
                    />
                </MapPopupPortal>
            ))}
        </>
    );
};

export default Map;
