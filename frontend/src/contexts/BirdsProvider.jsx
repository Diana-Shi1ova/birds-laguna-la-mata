import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';

// Creamos el contexto
const BirdsContext = createContext(null);

// Proveedor que va a guardar los datos sobre las aves
export function BirdsProvider({ children }) {
    const [birds, setBirds] = useState([]);                    // todas las aves
    const [filteredBirds, setFilteredBirds] = useState([]);    // aves filtradas
    const [searchQuery, setSearchQuery] = useState({
        species: [],                 // lista de especies a mostrar
        // name: "",                    
        favourites: false,           // mostrar solo favoritos
        period: true,                // petición del período o historial de un día
        selectedPeriod: 'today',     // período
        date: new Date(),            // fecha para pedir historial
        days: 1,                     // período personalizado
        ebird: true,                 // mostrar aves de eBird
        raspberries: true,           // mostrar aves de raspberries
    });
    const [area, setArea] = useState("L3906629");              // parque
    // const [back, setBack] = useState(1);

    // Hacer petición inicial de pájaros
    useEffect(() => {
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
                    hotspot: area,
                    // back: searchQuery.back
                    // back: back
                    back: period
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
            api.get('/eBird/history', {
                params: {
                    hotspot: area,
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


    return (
        <BirdsContext.Provider value={{
            birds,
            setBirds,
            searchQuery,
            setSearchQuery,
            filteredBirds,
            setFilteredBirds,
            area,
            setArea,
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