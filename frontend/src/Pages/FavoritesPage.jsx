import { useFavorites } from "../context/FavoritesContext";
import Header from "../Components/Header/Header";
import BookCard from "../Components/BookCard/BookCard";
import "../index.css";

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();

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
            color: 'var(--text-secondary)',
            fontFamily: 'Inter, sans-serif'
          }}>
            {favorites.length} {favorites.length === 1 ? 'book' : 'books'} saved
          </p>
        </div>
        {favorites.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'var(--card-bg)',
            borderRadius: '16px',
            boxShadow: '0 4px 20px var(--shadow)'
          }}>
            <p style={{
              fontSize: '1.25rem',
              color: 'var(--text-secondary)',
              fontFamily: 'Inter, sans-serif',
              margin: 0
            }}>
              No favorites yet. Search for books and add them to your collection!
            </p>
          </div>
        ) : (
          <div className="allBooksContainer">
            {favorites.map((book) => (
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
