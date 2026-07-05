import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { Moon, Sun, Heart } from "lucide-react";
import "./Header.css"
import LitScoutLogo from "../../images/LitScoutLogo.svg";

export default function Header(){
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    function handleLogoClick() {
        navigate('/');
        window.location.reload();
    }

    return (
        <header>
            <img
                className="title"
                src={LitScoutLogo}
                alt="LitScout Logo"
                onClick={handleLogoClick}
                style={{ cursor: 'pointer' }}
            />
            <div className="headerActions">
                <Link to="/favorites" className="favoritesLink" aria-label="Favorites">
                    <Heart size={20} />
                </Link>
                <button
                    className="themeToggle"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </header>
    )
}
