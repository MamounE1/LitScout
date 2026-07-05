import { Routes, Route } from "react-router-dom"
import { FavoritesProvider } from "./context/FavoritesContext";
import { ThemeProvider } from "./context/ThemeContext";
import BookListPage from "./Pages/BookListPage.jsx";
import BookDetailsPage from "./Pages/BookDetailsPage.jsx";
import FavoritesPage from "./Pages/FavoritesPage.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <Routes>
          <Route path="/" element={<BookListPage />} />
          <Route path="/book/:id" element={<BookDetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </FavoritesProvider>
    </ThemeProvider>
  )
}