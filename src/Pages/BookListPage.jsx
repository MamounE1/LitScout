import { useState, useEffect, useRef } from "react"
import { useAuth } from "../context/AuthContext"
import { getFavorites, addFavorite, removeFavorite } from "../utils/api"
import Header from "../Components/Header/Header.jsx"
import SearchBar from "../Components/SearchBar/SearchBar.jsx"
import BookList from "../Components/BookList/BookList.jsx"
import Filters from "../Components/Filters/Filters.jsx"
import "../index.css"

export default function BookListPage() {
  const { user, token } = useAuth();
  const loadMoreRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState(() => sessionStorage.getItem('searchQuery') || "")
  const [text, setText] = useState(() => sessionStorage.getItem('searchQuery') || "")
  const [books, setBooks] = useState(() => {
    const cached = sessionStorage.getItem('cachedBooks');
    return cached ? JSON.parse(cached) : [];
  })
  const [startIndex, setStartIndex] = useState(() => {
    const cached = sessionStorage.getItem('startIndex');
    return cached ? parseInt(cached, 10) : 0;
  });
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    language: 'all',
    sortBy: 'relevance',
    printType: 'all'
  });

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
      sessionStorage.removeItem('cachedBooks');
      sessionStorage.removeItem('startIndex');
      return;
    }
    
    // Check if we already have books cached for this query and startIndex
    const cachedQuery = sessionStorage.getItem('searchQuery');
    const cachedBooks = sessionStorage.getItem('cachedBooks');
    const cachedIndex = sessionStorage.getItem('startIndex');
    
    if (cachedQuery === searchQuery && cachedBooks && parseInt(cachedIndex, 10) === startIndex) {
      // Already have the data cached, no need to fetch
      return;
    }
    
    // Build API URL with filters
    let apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}`;
    
    // Add category filter
    if (filters.category !== 'all') {
      apiUrl += `+subject:${filters.category}`;
    }
    
    // Add language filter
    if (filters.language !== 'all') {
      apiUrl += `&langRestrict=${filters.language}`;
    }
    
    // Add sort order
    if (filters.sortBy === 'newest') {
      apiUrl += `&orderBy=newest`;
    } else {
      apiUrl += `&orderBy=relevance`;
    }
    
    // Add print type
    if (filters.printType !== 'all') {
      apiUrl += `&printType=${filters.printType}`;
    }
    
    apiUrl += `&startIndex=${startIndex}&maxResults=10`;
    
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        setBooks(prev => {
          const updated = [...prev, ...(data.items || [])];
          sessionStorage.setItem('cachedBooks', JSON.stringify(updated));
          sessionStorage.setItem('startIndex', startIndex.toString());
          return updated;
        })
      })
  }, [startIndex, searchQuery, filters])

  useEffect(() => {
    if (!searchQuery) return;

    const observer = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting){
        setStartIndex(prev => prev + 10)
      }
    })

    if(loadMoreRef.current){
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [searchQuery])
  
  function onSearch(){
    const trimmedText = text.trim();
    setBooks([])
    setStartIndex(0)
    setSearchQuery(trimmedText)
    sessionStorage.setItem('searchQuery', trimmedText);
    sessionStorage.removeItem('cachedBooks');
    sessionStorage.removeItem('startIndex');
  }

  function handleFilterChange(filterName, value) {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setBooks([]);
    setStartIndex(0);
    sessionStorage.removeItem('cachedBooks');
    sessionStorage.removeItem('startIndex');
  }

  function handleClearFilters() {
    setFilters({
      category: 'all',
      language: 'all',
      sortBy: 'relevance',
      printType: 'all'
    });
    setBooks([]);
    setStartIndex(0);
    sessionStorage.removeItem('cachedBooks');
    sessionStorage.removeItem('startIndex');
  }

  return (
    <>
      <Header />
      <SearchBar 
        text={text} 
        setText={setText} 
        onSearch={onSearch}
      />
      {searchQuery && (
        <Filters 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      )}
      <BookList 
        books={books} 
        loadMoreRef={loadMoreRef} 
        favorites={favorites} 
        toggleFavorite={toggleFavorite}
      />
    </>
  )
}
