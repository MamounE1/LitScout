import { useState, useEffect, useRef } from "react"
import { useAuth } from "../context/AuthContext"
import { getFavorites, addFavorite, removeFavorite } from "../utils/api"
import Header from "../Components/Header/Header.jsx"
import SearchBar from "../Components/SearchBar/SearchBar.jsx"
import BookList from "../Components/BookList/BookList.jsx"
import "../index.css"

export default function BookListPage() {
  const { user, token } = useAuth();
  const loadMoreRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("")
  const [text, setText] = useState("")
  const [books, setBooks] = useState([])
  const [favoriteBooks, setFavoriteBooks] = useState([])
  const [startIndex, setStartIndex] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  useEffect(() => {
    if (user && token) {
      loadFavorites();
    }
  }, [user, token]);

  async function loadFavorites() {
    try {
      const favs = await getFavorites(token);
      setFavorites(favs);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  }

  async function loadFavoriteBooks() {
    if (!user || favorites.length === 0) {
      setFavoriteBooks([]);
      return;
    }
    
    setLoadingFavorites(true);
    try {
      const bookPromises = favorites.map(bookId =>
        fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
          .then(res => res.json())
          .catch(() => null)
      );
      const books = await Promise.all(bookPromises);
      setFavoriteBooks(books.filter(book => book !== null));
    } catch (err) {
      console.error('Failed to load favorite books:', err);
    } finally {
      setLoadingFavorites(false);
    }
  }

  useEffect(() => {
    if (showFavorites) {
      loadFavoriteBooks();
    }
  }, [showFavorites, favorites]);

  async function toggleFavorite(bookId) {
    if (!user) {
      alert('Please login to save favorites');
      return;
    }

    try {
      if (favorites.includes(bookId)) {
        await removeFavorite(bookId, token);
        setFavorites(prev => prev.filter(id => id !== bookId));
      } else {
        await addFavorite(bookId, token);
        setFavorites(prev => [...prev, bookId]);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  }

  useEffect(() => {
    if (!searchQuery) {
      setBooks([]);
      return;
    }
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&startIndex=${startIndex}&maxResults=10`)
      .then(res => res.json())
      .then(data => {
        setBooks(prev => [...prev, ...(data.items || [])])
      })
  }, [startIndex, searchQuery])

  useEffect(() => {
    if (showFavorites || !searchQuery) return;

    const observer = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting){
        setStartIndex(prev => prev + 10)
      }
    })

    if(loadMoreRef.current){
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [showFavorites, searchQuery])
  
  function onSearch(){
    setShowFavorites(false);
    setBooks([])
    setStartIndex(0)
    setSearchQuery(text.trim())
    setText("")
  }

  return (
    <>
      <Header />
      <SearchBar 
        text={text} 
        setText={setText} 
        onSearch={onSearch}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
      />
      {loadingFavorites ? (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading favorites...</p>
      ) : (
        <BookList 
          books={showFavorites ? favoriteBooks : books} 
          loadMoreRef={loadMoreRef} 
          favorites={favorites} 
          toggleFavorite={toggleFavorite}
        />
      )}
    </>
  )
}