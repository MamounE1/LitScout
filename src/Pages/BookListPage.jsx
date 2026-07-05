import { useState, useEffect, useRef } from "react"
import { useFavorites } from "../context/FavoritesContext"
import { normalizeBook, toOpenLibraryLanguage, SEARCH_FIELDS } from "../utils/openLibrary"
import Header from "../Components/Header/Header.jsx"
import SearchBar from "../Components/SearchBar/SearchBar.jsx"
import BookList from "../Components/BookList/BookList.jsx"
import Filters from "../Components/Filters/Filters.jsx"
import { DEFAULT_FILTERS } from "../Components/Filters/defaultFilters"
import "../index.css"

// A hard reload (e.g. the logo click, or the user refreshing the page) should
// start with a clean search, unlike SPA navigation (e.g. back from a book's
// detail page), which should keep the cached search results.
const isHardReload = typeof performance !== 'undefined' &&
  performance.getEntriesByType('navigation')[0]?.type === 'reload';

if (isHardReload) {
  sessionStorage.removeItem('searchQuery');
  sessionStorage.removeItem('cachedBooks');
  sessionStorage.removeItem('startIndex');
}

export default function BookListPage() {
  const { isFavorite, toggleFavorite } = useFavorites();
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
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

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
    
    // Build API URL with filters (Open Library search API)
    let q = searchQuery;

    // Add category filter
    if (filters.category !== 'all') {
      q += ` subject:${filters.category}`;
    }

    const params = new URLSearchParams({
      q,
      offset: startIndex,
      limit: 10,
      fields: SEARCH_FIELDS
    });

    // Add language filter
    if (filters.language !== 'all') {
      params.set('language', toOpenLibraryLanguage(filters.language));
    }

    // Add sort order
    if (filters.sortBy === 'newest') {
      params.set('sort', 'new');
    }

    fetch(`https://openlibrary.org/search.json?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        const newBooks = (data.docs || []).map(doc => normalizeBook(doc));
        setBooks(prev => {
          const updated = [...prev, ...newBooks];
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
    setFilters(DEFAULT_FILTERS);
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
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
      />
    </>
  )
}
