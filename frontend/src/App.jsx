import { Routes, Route } from "react-router-dom"
import { FavoritesProvider } from "./context/FavoritesContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import BookListPage from "./Pages/BookListPage.jsx";
import BookDetailsPage from "./Pages/BookDetailsPage.jsx";
import FavoritesPage from "./Pages/FavoritesPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import RegisterPage from "./Pages/RegisterPage.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <Routes>
            <Route path="/" element={<BookListPage />} />
            <Route path="/book/:id" element={<BookDetailsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
