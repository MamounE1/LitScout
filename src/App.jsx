import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import BookListPage from "./Pages/BookListPage.jsx";
import BookDetailsPage from "./Pages/BookDetailsPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import RegisterPage from "./Pages/RegisterPage.jsx";
import FavoritesPage from "./Pages/FavoritesPage.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<BookListPage />} />
          <Route path="/book/:id" element={<BookDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}