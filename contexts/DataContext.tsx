
import React, { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Motorcycle } from '../types';

interface DataContextType {
  motorcycles: Motorcycle[];
  addMotorcycle: (motorcycle: Omit<Motorcycle, 'id' | 'status' | 'saleDate' | 'sellingPrice' | 'purchaseDate'>) => void;
  updateMotorcycle: (updatedMotorcycle: Motorcycle) => void;
  getMotorcycleById: (id: string) => Motorcycle | undefined;
  forSaleMotorcycles: Motorcycle[];
  soldMotorcycles: Motorcycle[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [motorcycles, setMotorcycles] = useLocalStorage<Motorcycle[]>('motorcycles', []);

  const addMotorcycle = (motorcycle: Omit<Motorcycle, 'id' | 'status' | 'saleDate' | 'sellingPrice' | 'purchaseDate'>) => {
    const newMotorcycle: Motorcycle = {
      ...motorcycle,
      id: crypto.randomUUID(),
      status: 'For Sale',
      saleDate: null,
      sellingPrice: null,
      purchaseDate: new Date().toISOString(),
    };
    setMotorcycles(prev => [...prev, newMotorcycle]);
  };

  const updateMotorcycle = (updatedMotorcycle: Motorcycle) => {
    setMotorcycles(prev =>
      prev.map(m => (m.id === updatedMotorcycle.id ? updatedMotorcycle : m))
    );
  };
  
  const getMotorcycleById = (id: string) => {
    return motorcycles.find(m => m.id === id);
  };

  const forSaleMotorcycles = useMemo(() => 
    motorcycles.filter(m => m.status === 'For Sale').sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()), 
    [motorcycles]
  );

  const soldMotorcycles = useMemo(() => 
    motorcycles.filter(m => m.status === 'Sold').sort((a, b) => new Date(b.saleDate!).getTime() - new Date(a.saleDate!).getTime()), 
    [motorcycles]
  );

  const value = {
    motorcycles,
    addMotorcycle,
    updateMotorcycle,
    getMotorcycleById,
    forSaleMotorcycles,
    soldMotorcycles,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
