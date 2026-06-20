import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { SearchGroup } from '../types/search';

interface GlobalSearchContextType {
  query: string;
  setQuery: (query: string) => void;
  results: SearchGroup[];
  setResults: (results: SearchGroup[]) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(undefined);

export const GlobalSearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchGroup[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <GlobalSearchContext.Provider 
      value={{ 
        query, 
        setQuery, 
        results, 
        setResults, 
        isOpen, 
        setIsOpen 
      }}
    >
      {children}
    </GlobalSearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(GlobalSearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a GlobalSearchProvider');
  }
  return context;
};