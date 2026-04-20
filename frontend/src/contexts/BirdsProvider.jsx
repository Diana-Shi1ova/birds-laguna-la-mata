import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';

// Creamos el contexto
const BirdsContext = createContext(null);

// Proveedor que va a guardar los datos sobre las aves
export function BirdsProvider({ children }) {
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
    const [area, setArea] = useState("69e16d8d48ce5b0d0d8f9b23");              // parque (LLMT)
    // const [back, setBack] = useState(1);
    const [simpleSearch, setSimpleSearch] = useState([]);                     // búsqueda simple por nombre

    // Hacer petición inicial de pájaros
    useEffect(() => {
        if(!searchQuery.ebird) {
            setFilteredBirds([]);
            return;
        }
            
        if(searchQuery.period){ // Petición de aves del período
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
                    parkId: area,
                    // back: searchQuery.back
                    // back: back
                    back: period,
                }
            })
            .then(response => {
                console.log(response.data);
                setBirds(response.data);
                filterByNames(response.data);
                // setFilteredBirds(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
        else{
            // eBird
            api.get('/eBird/history', {
                params: {
                    parkId: area,
                    date: formatDateAPI(searchQuery.date)
                }
            })
            .then(response => {
                console.log(response.data);
                setBirds(response.data);
                filterByNames(response.data);
                // setFilteredBirds(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }, [area, searchQuery]);


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
        searchQuery.species.length>0 ? console.log(searchQuery.species.join(',')) : console.log(simpleSearch)
        if(!searchQuery.rpa && rasp.type==='audio') return;
        if(!searchQuery.rpi && rasp.type==='image') return;

        const [date, period] = dateOrPeriod();
        console.log(searchQuery.species);
        try {
            const res = await api.get(`/raspBird/${rasp.type}/${rasp._id}`, {
                params: {
                    period: period,
                    date: date,
                    // names: searchQuery.species.join(',')
                    names: searchQuery.species.length>0 ? searchQuery.species.join(',') : simpleSearch
                }
            });

            const data = res.data;
            return data;

        } catch (err) {
            console.error("Error loading rasp data:", err);
        } /*finally {
            return data;
        }*/
    }


    // Petición de aves de Raspberries
    /*useEffect(() => {
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

        // Aves de raspberry vídeo
        api.get('/raspBird/audio', {
            params: {
                // hotspot: area,
                // back: searchQuery.back
                // back: back
                period: period,
                date: date
            }
        })
        .then(response => {
            console.log(response.data);
            setRaspberryAudioBirds(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

        // Aves de raspberry imagen
        api.get('/raspBird/image', {
            params: {
                // hotspot: area,
                // back: searchQuery.back
                // back: back
                // period: period
                period: period,
                date: date
            }
        })
        .then(response => {
            console.log(response.data);
            setRaspberryImageBirds(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [area, searchQuery]);*/
    

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
            setSimpleSearch
            // back,
            // setBack
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