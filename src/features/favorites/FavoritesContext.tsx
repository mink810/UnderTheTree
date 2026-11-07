import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

type FavoritesContextType = {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const value = useMemo(
    () => ({
      favoriteIds,
      toggleFavorite: (id: string) => {
        setFavoriteIds((prev) =>
          prev.includes(id)
            ? prev.filter((item) => item !== id)
            : [...prev, id]
        );
      },
      isFavorite: (id: string) => favoriteIds.includes(id),
    }),
    [favoriteIds]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('FavoritesProvider가 필요합니다.');
  }

  return context;
}
