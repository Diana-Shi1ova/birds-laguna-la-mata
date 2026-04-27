import { createContext, useContext, useState } from 'react'

const SearchUIContext = createContext(null)

export function SearchUIProvider({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filters, setFilters] = useState(true);               // mostrar/ocultar filtros
  const [searchType, setSearchType] = useState('map');        // tipo de búsquda a realizar ("map", "catalog", "statistics")
  const [value, setValue] = useState('');                     // valor introducido
  const [filtersPannel, setFiltersPannel] = useState('');     // mostrar/ocultar panel con filtros

  return (
    <SearchUIContext.Provider
      value={{
        isSearchOpen,
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),
        toggleSearch: () => setIsSearchOpen(v => !v),
        filters,
        setFilters,
        searchType,
        setSearchType,
        value,
        setValue,
        filtersPannel,
        setFiltersPannel
      }}
    >
      {children}
    </SearchUIContext.Provider>
  )
}

export const useSearchUI = () => {
  const ctx = useContext(SearchUIContext)
  if (!ctx) {
    throw new Error('useSearchUI must be used within SearchUIProvider')
  }
  return ctx
}