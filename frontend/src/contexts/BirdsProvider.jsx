import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';
import { UseAuth } from '../auth/useAuth';
import { useTranslation } from 'react-i18next';

// Creamos el contexto
const BirdsContext = createContext(null);

// Proveedor que va a guardar los datos sobre las aves
export function BirdsProvider({ children }) {
    const { i18n } = useTranslation();
    const {user, isAuth} = UseAuth();
    const [birds, setBirds] = useState([]);                                     // todas las aves de eBird
    const [raspberryAudioBirds, setRaspberryAudioBirds] = useState([]);         // aves de Raspberry audio
    const [raspberryImageBirds, setRaspberryImageBirds] = useState([]);         // aves de Raspberry imagen
    const [filteredBirds, setFilteredBirds] = useState([]);                     // aves filtradas
    const [searchQuery, setSearchQuery] = useState({
        species: [],                 // lista de especies a mostrar
        // name: "",                    
        favourites: false,           // mostrar solo favoritos
        period: true,                // petición del período o historial de un día
        selectedPeriod: 'today',     // período
        date: new Date(),            // fecha para pedir historial
        days: 1,                     // período personalizado
        ebird: true,                 // mostrar aves de eBird
        rpa: true,                   // mostrar aves de raspberries audio
        rpi: true,                   // mostrar aves de raspberries imagen
    });
    const [area, setArea] = useState("69e16d8d48ce5b0d0d8f9b23");       // parque (LLMT)
    const [parkData, setParkData] = useState({
        parkId: "69e16d8d48ce5b0d0d8f9b23",
        lat: 38.01041,
        long: -0.70461,
        zoom: 12
    });
    // const [back, setBack] = useState(1);
    const [simpleSearch, setSimpleSearch] = useState([]);        // búsqueda simple por nombre
    const [favourites, setFavourites] = useState(new Map());     // favoritos
    const [raspResults, setRaspResults] = useState(0)            // número de resultados de raspberries
    const [loading, setLoading] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState(false);


    // Hacer petición inicial de pájaros
    useEffect(() => {
        setLoading(true);
        // Calcular resultados raspberries
        if(!searchQuery.rpa && !searchQuery.rpi) {
            setRaspResults(0);
            return;
        }

        const [date, period] = dateOrPeriod();

        let type = "";
        if(searchQuery.rpa && !searchQuery.rpi) type = "audio";
        else if(!searchQuery.rpa && searchQuery.rpi) type = "image";

        api.get(`/raspBird/total/${parkData.parkId}`, {
                params: {
                    period: period,
                    date: date,
                    // names: searchQuery.species.join(',')
                    names: searchQuery.species.length>0 ? searchQuery.species.join(',') : simpleSearch,
                    type: type
                }
            })
            .then(response => {
                setRaspResults(response.data.total);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });

        // No hacer peticiones a eBird si no está marcado
        if(!searchQuery.ebird) {
            setFilteredBirds([]);
            setLoading(false);
            return;
        }
        
        // Petición de aves del período
        if(searchQuery.period){ 
            // Definir período
            let period = 1;

            switch(searchQuery.selectedPeriod){
                case 'today':
                    period = 1;
                    break;
                case 'week':
                    period = 7;
                    break;
                case 'month':
                    period = 30;
                    break;
                case 'custom':
                    period = searchQuery.days;
                    break;
            }

            api.get('/eBird', {
                params: {
                    parkId: parkData.parkId,
                    back: period,
                    locale: i18n.resolvedLanguage
                }
            })
            .then(response => {
                setBirds(response.data);
                filterByNames(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
        // Petición del histórico en una fecha
        else{
            api.get('/eBird/history', {
                params: {
                    parkId: parkData.parkId,
                    date: formatDateAPI(searchQuery.date),
                    locale: i18n.resolvedLanguage
                }
            })
            .then(response => {
                setBirds(response.data);
                filterByNames(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }, [parkData, searchQuery, i18n.resolvedLanguage]);

    // Favoritos
    useEffect(() => {
        if (!user) {
            setFavourites(new Map());
            return
        };

        if(isAuth){
            api.get(`/favourite/${user._id}`)
            .then(response => {

                const favMap = new Map(
                    (response.data.data || []).map(f => [f.specieId, f._id])
                );

                setFavourites(favMap);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
        
    }, [user, isAuth]);

    // Tipo temporal de búsqueda
    function dateOrPeriod(){
        let date = formatDateRaspberries(searchQuery.date);
        let period = 1; 

        if(searchQuery.period){
            date='';

            switch(searchQuery.selectedPeriod){
                case 'today':
                    period = 1;
                    break;
                case 'week':
                    period = 7;
                    break;
                case 'month':
                    period = 30;
                    break;
                case 'custom':
                    period = searchQuery.days;
                    break;
            }
        }
        else{
            period='';
        }

        return [date,period]
    }

    async function getRaspberryDetections(rasp) {
        if(!searchQuery.rpa && rasp.type==='audio') return;
        if(!searchQuery.rpi && rasp.type==='image') return;

        const [date, period] = dateOrPeriod();
        try {
            const res = await api.get(`/raspBird/${rasp.type}/${rasp._id}`, {
                params: {
                    period: period,
                    date: date,
                    names: searchQuery.species.length>0 ? searchQuery.species.join(',') : simpleSearch
                }
            });

            const data = res.data;
            return data;

        } catch (err) {
            console.error("Error loading rasp data:", err);
        }
    }
    

    // Filtrar por nombres
    function filterByNames(birds){
        const filtered = 
            !searchQuery.species || searchQuery.species.length === 0
            ? birds
            : birds.filter(bird =>
                searchQuery.species.some(query =>
                    normalizeText(bird.comName).includes(query.toLowerCase()) ||
                    normalizeText(bird.sciName).includes(query.toLowerCase())
                )
        );

        setFilteredBirds(filtered);
    }

    // Normalizar texto para búsqueda (minúsculas y no tener en cuenta los acentos y ñ)
    function normalizeText (text){
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    };

    // Formatear fecha al formato aaaa/mm/dd para hacer petición al API
    function formatDateAPI(date = new Date()) {
        const d = new Date(date);

        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');

        return `${yyyy}/${mm}/${dd}`;
    }

    // Formatear fecha al formato aaaa-mm-dd para hacer petición al API
    function formatDateRaspberries(date = new Date()) {
        const d = new Date(date);

        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');

        return `${yyyy}-${mm}-${dd}`;
    }


    return (
        <BirdsContext.Provider value={{
            birds,
            setBirds,
            raspberryAudioBirds,
            raspberryImageBirds,
            searchQuery,
            setSearchQuery,
            filteredBirds,
            setFilteredBirds,
            area,
            setArea,
            getRaspberryDetections,
            dateOrPeriod,
            simpleSearch,
            setSimpleSearch,
            parkData,
            setParkData,
            favourites,
            setFavourites,
            raspResults,
            loading,
            setLoading,
            appliedFilters,
            setAppliedFilters
        }}>
        {children}
        </BirdsContext.Provider>
    );
}

// Usar el contexto
export const useBirds = () => {
    const ctx = useContext(BirdsContext);
    if (!ctx) throw new Error('useBirds must be used within BirdsProvider');
    return ctx;
};