import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';

// Creamos el contexto
const BirdsContext = createContext(null);

// Proveedor que va a guardar los datos sobre las aves
export function BirdsProvider({ children }) {
    const [birds, setBirds] = useState([]);                    // todas las aves
    const [filteredBirds, setFilteredBirds] = useState([]);    // aves filtradas
    const [searchQuery, setSearchQuery] = useState({
        names: [],
        date: '',
        source: '',
        back: 1
    });
    const [area, setArea] = useState("L3906629");              // parque

    // Hacer petición inicial de pájaros
    useEffect(() => {
        // Petición al servidor
        api.get('/eBird', {
            params: {
                hotspot: area,
                back: searchQuery.back
            }
        })
        .then(response => {
            console.log(response.data);
            setBirds(response.data);
            setFilteredBirds(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [area]);


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