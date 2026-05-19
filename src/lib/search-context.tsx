import { createContext, useContext, useState, type ReactNode } from "react";

type SearchContextValue = {
  headerSearch: string;
  setHeaderSearch: (search: string) => void;
};

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [headerSearch, setHeaderSearch] = useState("");

  return (
    <SearchContext.Provider value={{ headerSearch, setHeaderSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
