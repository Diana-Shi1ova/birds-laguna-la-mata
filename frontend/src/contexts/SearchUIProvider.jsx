import { createContext, useContext, useState } from 'react'

const SearchUIContext = createContext(null)

export function SearchUIProvider({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <SearchUIContext.Provider
      value={{
        isSearchOpen,
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),
        toggleSearch: () => setIsSearchOpen(v => !v),
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