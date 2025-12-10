import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getFavorites } from "../utils/api";
import Header from "../Components/Header/Header";
import BookCard from "../Components/BookCard/BookCard";
import "../index.css";

export default function FavoritesPage() {
  const { user, token } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      loadFavorites();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  async function loadFavorites() {
    try {
      const favs = await getFavorites(token);
      setFavorites(favs);
      
      if (favs.length > 0) {
        const bookPromises = favs.map(bookId =>
          fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
            .then(res => res.json())
            .catch(() => null)
        );
        const books = await Promise.all(bookPromises);
        setFavoriteBooks(books.filter(book => book !== null));
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFavorite(bookId) {
    const { removeFavorite } = await import("../utils/api");
    try {
      await removeFavorite(bookId, token);
      setFavorites(prev => prev.filter(id => id !== bookId));
      setFavoriteBooks(prev => prev.filter(book => book.id !== bookId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  }

  if (!user) {
    return (
      <>
        <Header />
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <h2>Please login to view your favorites</h2>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p>Loading favorites...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>My Favorites</h1>
        {favoriteBooks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>
            No favorites yet. Search for books and add them to your favorites!
          </p>
        ) : (
          <div className="allBooksContainer">
            {favoriteBooks.map((book) => (
              <BookCard 
                key={book.id} 
                book={book}
                isFavorite={true}
                toggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
