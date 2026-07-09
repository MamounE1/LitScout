import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function toBook(row) {
  return {
    id: row.book_id,
    volumeInfo: {
      title: row.title,
      authors: row.authors ?? undefined,
      imageLinks: row.cover_url ? { thumbnail: row.cover_url } : undefined,
    },
  };
}

function toPayload(book) {
  return {
    book_id: book.id,
    title: book.volumeInfo.title,
    authors: book.volumeInfo.authors ?? null,
    cover_url: book.volumeInfo.imageLinks?.thumbnail ?? null,
  };
}

export function FavoritesProvider({ children }) {
  const { user, token } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user || !token) {
      setFavorites([]);
      return;
    }

    (async () => {
      const res = await fetch(`${API_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setFavorites((await res.json()).map(toBook));
      }
    })();
  }, [user, token]);

  function isFavorite(bookId) {
    return favorites.some((book) => book.id === bookId);
  }

  async function toggleFavorite(book) {
    if (!user || !token) return;

    const already = isFavorite(book.id);
    if (already) {
      setFavorites((prev) => prev.filter((b) => b.id !== book.id));
      await fetch(`${API_URL}/favorites/${book.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      setFavorites((prev) => [...prev, book]);
      await fetch(`${API_URL}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(toPayload(book)),
      });
    }
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}
