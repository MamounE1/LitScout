import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext";
import BookListPage from "./Pages/BookListPage.jsx";
import BookDetailsPage from "./Pages/BookDetailsPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import RegisterPage from "./Pages/RegisterPage.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<BookListPage />} />
        <Route path="/book/:id" element={<BookDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </AuthProvider>
  )
}