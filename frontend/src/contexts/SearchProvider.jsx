import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
    const [query, setQuery] = useState("");
    const [searchHandler, setSearchHandler] = useState(() => () => {});

    const handleSearch = (value) => {
        setQuery(value);
        searchHandler(value);
    };

    return (
        <SearchContext.Provider value={{
            query,
            setQuery,
            setSearchHandler,
            handleSearch
        }}>
            {children}
        </SearchContext.Provider>
    );
};

// Usar el contexto
export const useSearch = () => {
    const ctx = useContext(SearchContext);
    if (!ctx) throw new Error('useSearch must be used within SearchProvider');
    return ctx;
};