import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';

const StatisticsContext = createContext(null);

export const StatisticsProvider = ({ children }) => {
    const [currentPark, setCurrentPark] = useState('LLMT');

    return (
        <StatisticsContext.Provider value={{
            currentPark,
            setCurrentPark
        }}>
            {children}
        </StatisticsContext.Provider>
    );
};

// Usar el contexto
export const useStatistics = () => {
    const ctx = useContext(StatisticsContext);
    if (!ctx) throw new Error('useStatistics must be used within StatisticsProvider');
    return ctx;
};