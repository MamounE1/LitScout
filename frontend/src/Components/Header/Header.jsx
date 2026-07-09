import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Moon, Sun, Heart, LogOut } from "lucide-react";
import "./Header.css"
import LitScoutLogo from "../../images/LitScoutLogo.svg";

function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function Header(){
    const { isDark, toggleTheme } = useTheme();
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const menuRef = useRef(null);

    function handleLogoClick() {
        navigate('/');
        window.location.reload();
    }

    function handleLogout() {
        logout();
        setDropdownOpen(false);
        navigate('/');
    }

    // Close the dropdown on outside click or Escape.
    useEffect(() => {
        if (!dropdownOpen) return;

        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        }
        function handleEscape(e) {
            if (e.key === 'Escape') setDropdownOpen(false);
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [dropdownOpen]);

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

                {loading ? (
                    <div className="avatarSkeleton" aria-hidden="true" />
                ) : user ? (
                    <div className="userMenu" ref={menuRef}>
                        <button
                            className="avatarBtn"
                            onClick={() => setDropdownOpen((open) => !open)}
                            aria-label="Account menu"
                            aria-haspopup="true"
                            aria-expanded={dropdownOpen}
                        >
                            {getInitials(user.name)}
                        </button>
                        {dropdownOpen && (
                            <div className="dropdown" role="menu">
                                <div className="dropdownHeader">
                                    <span className="dropdownName">{user.name}</span>
                                    <span className="dropdownEmail">{user.email}</span>
                                </div>
                                <div className="dropdownDivider" />
                                <Link
                                    to="/favorites"
                                    className="dropdownItem"
                                    role="menuitem"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    <Heart size={16} />
                                    Favorites
                                </Link>
                                <div className="dropdownDivider" />
                                <button
                                    className="dropdownItem logoutBtn"
                                    role="menuitem"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={16} />
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login">
                        <button className="signInBtn">Sign In</button>
                    </Link>
                )}
            </div>
        </header>
    )
}
