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
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '60vh',
          fontFamily: 'Inter, sans-serif'
        }}>
          <h2 style={{ 
            fontSize: '2rem',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '1rem'
          }}>Please login to view your favorites</h2>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '60vh',
          fontFamily: 'Inter, sans-serif',
          fontSize: '1.25rem',
          color: '#718096'
        }}>
          <p>Loading your favorites...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ 
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '3rem 2rem'
      }}>
        <div style={{
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '3rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem',
            fontFamily: 'Inter, sans-serif'
          }}>My Favorites</h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#718096',
            fontFamily: 'Inter, sans-serif'
          }}>
            {favoriteBooks.length} {favoriteBooks.length === 1 ? 'book' : 'books'} saved
          </p>
        </div>
        {favoriteBooks.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <p style={{ 
              fontSize: '1.25rem',
              color: '#718096',
              fontFamily: 'Inter, sans-serif',
              margin: 0
            }}>
              No favorites yet. Search for books and add them to your collection!
            </p>
          </div>
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
